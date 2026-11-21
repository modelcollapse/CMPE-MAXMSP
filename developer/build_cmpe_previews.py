"""Render reproducible CMPE interface previews, not native Max screenshots.

Run from any directory with Python 3, Pillow, and Node.js installed:
    python3 developer/build_cmpe_previews.py

The current maxpat supplies geometry, colors, and font sizes. The shipped
controller supplies visible objects and text. APG and SIOE waveforms are rendered
from the included demo WAVs by the actual shipped controller/renderer at 48 kHz.
Live modes are shown stopped; this script neither executes native MSP objects
nor invents scope traces. An additional state sheet records real APG controller
transitions with simulated file-I/O and audio-start callbacks. Font rasterization
and Max widget drawing are approximations. Visible captions and PNG metadata
retain that distinction.
"""

from pathlib import Path
import json
import os
import subprocess

from PIL import Image, ImageDraw, ImageFont, PngImagePlugin


ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "images"
OUT.mkdir(parents=True, exist_ok=True)
SCALE = 2
PATCH = json.loads((ROOT / "CMPE_Variety_Pack.maxpat").read_text())["patcher"]
WIDTH, HEIGHT = [round(n) for n in PATCH["rect"][2:]]
FOOTER = 40

NODE = r'''
const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const root=process.argv[1];
const patch=JSON.parse(fs.readFileSync(path.join(root,'CMPE_Variety_Pack.maxpat'),'utf8')).patcher;
const runtime=fs.readFileSync(path.join(root,'cmpe_variety.js'),'utf8');
function random(seed){let n=seed>>>0;return()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return(n>>>0)/4294967296;};}
function wav(file){
    const bytes=fs.readFileSync(file);
    if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WAVE')throw Error('Not a WAV');
    let format,channels,sr,bits,body;
    for(let p=12;p+8<=bytes.length;){
        const kind=bytes.toString('ascii',p,p+4),size=bytes.readUInt32LE(p+4),first=p+8;
        if(kind==='fmt '){format=bytes.readUInt16LE(first);channels=bytes.readUInt16LE(first+2);sr=bytes.readUInt32LE(first+4);bits=bytes.readUInt16LE(first+14);}
        if(kind==='data')body=bytes.subarray(first,first+size);
        p=first+size+(size%2);
    }
    if(format!==1||bits!==16||!body)throw Error('Preview supports the shipped PCM16 WAV fixtures');
    const frames=body.length/(channels*2),data=Array.from({length:channels},()=>new Float32Array(frames));
    for(let i=0;i<frames;i++)for(let c=0;c<channels;c++)data[c][i]=body.readInt16LE((i*channels+c)*2)/32768;
    return{frames,sr,channels,data};
}
const reports=[],stages=[];
for(let mode=0;mode<5;mode++){
    const boxes=JSON.parse(JSON.stringify(patch.boxes)).map(e=>e.box),objects=new Map(),buffers=new Map(),names=new Map(),tasks=[];
    let now=0,cpu=0,context;
    const math=Object.create(Math);math.random=random(91);
    const clock=()=>now+cpu;
    const fresh=()=>({frames:1,sr:48000,channels:2,data:[new Float32Array(1),new Float32Array(1)]});
    function Task(fn,self){this.fn=fn;this.self=self;this.active=false;this.due=Infinity;this.cancel=()=>{this.active=false;};this.schedule=ms=>{this.active=true;this.due=clock()+Number(ms);};tasks.push(this);}
    for(const box of boxes){
        box.message=function(selector,...args){
            if(selector==='set'){
                if(this.maxclass==='comment')this.text=String(args[0]);else this.value=args[0];
                if(this.maxclass==='jsui')this.xy=args.slice(0,2);
            }else if(selector==='text')this.text=String(args[0]);
            else if(['bgcolor','bgoncolor','bgovercolor','textcolor','textoncolor','textovercolor','bordercolor','waveformcolor','gridcolor','selectioncolor','knobcolor','elementcolor','fgcolor','ignoreclick','active','vzoom','line','fontsize','fontface'].includes(selector))this[selector]=args.length>1?args:args[0];
            else if(selector==='clear'&&this.maxclass==='umenu')this.items=[];
            else if(selector==='append'&&this.maxclass==='umenu')this.items.push(args[0]);
            else if(selector==='name'){names.set(this.varname,args[0]);buffers.set(args[0],fresh());}
            if(selector==='list'&&this.varname==='wave_link'){
                for(const name of ['wave_l','wave_r'])objects.get(name).waveView=args.slice(0,4);
            }
            if(selector==='clear'&&names.has(this.varname))buffers.get(names.get(this.varname)).data.forEach(ch=>ch.fill(0));
            if(selector==='read'&&/^source[123]$/.test(this.varname)){
                const slot=Number(this.varname.slice(-1))-1,target=names.get(this.varname),file=args[0];
                const task=new Task(()=>{buffers.set(target,wav(file));context.loaded(slot);},null);task.schedule(1);
            }
            if(this.varname==='output_buffer'){
                const b=buffers.get(names.get(this.varname));
                if(selector==='sr')b.sr=Number(args[0]);
                if(selector==='sizeinsamps'){b.frames=Number(args[0]);b.channels=args.length>1?Number(args[1]):b.channels;b.data=Array.from({length:b.channels},()=>new Float32Array(b.frames));}
                if(selector==='normalize'){
                    let peak=0;for(const ch of b.data)for(const v of ch)peak=Math.max(peak,Math.abs(v));
                    if(peak)for(const ch of b.data)for(let i=0;i<ch.length;i++)ch[i]*=Number(args[0])/peak;
                }
            }
        };
        if(box.varname)objects.set(box.varname,box);
    }
    function MaxBuffer(name){
        const get=()=>{const b=buffers.get(name);if(!b)throw Error('Missing buffer '+name);return b;};
        this.framecount=()=>get().frames;this.length=()=>1000*get().frames/get().sr;this.channelcount=()=>get().channels;
        this.peek=(channel,first,count)=>{const a=get().data[channel-1].slice(first,first+count);return count===1?a[0]:Array.from(a);};
        this.poke=(channel,first,data)=>get().data[channel-1].set(typeof data==='number'?[data]:data,first);
    }
    function FakeDate(){this.getTime=()=>{if(context&&context.state==='rendering')cpu++;return 1700000000000+clock();};}
    context=vm.createContext({patcher:{filepath:path.join(root,'CMPE_Variety_Pack.maxpat'),getnamed:n=>objects.get(n)||null},
        Buffer:MaxBuffer,Task,arrayfromargs:a=>Array.from(a),post(){},error(){},outlet(){},Math:math,Date:FakeDate});
    vm.runInContext(runtime,context,{filename:'cmpe_variety.js'});
    function until(predicate){let steps=0;while(!predicate()){
        if(++steps>100000)throw Error('Preview task bound');
        const t=tasks.filter(x=>x.active).sort((a,b)=>a.due-b.due)[0];
        if(!t)throw Error('No task; status: '+objects.get('status').text);
        now=Math.max(clock(),t.due);cpu=0;t.active=false;t.fn.call(t.self);now+=cpu;cpu=0;
    }}
    function snapshot(label, detail){
        const b=buffers.get(context.outputName),bins=760;
        const waveform=(mode===0||mode===4)&&b&&b.frames>1?b.data.map(ch=>Array.from({length:bins},(_,i)=>{
            const first=Math.floor(i*ch.length/bins),last=Math.floor((i+1)*ch.length/bins);let min=0,max=0;
            for(let n=first;n<last;n++){min=Math.min(min,ch[n]);max=Math.max(max,ch[n]);}
            return[min,max];
        })):null;
        // A snapshot is immutable: later controller updates must not change an
        // earlier progress/state image or its waveform samples.
        const visible=JSON.parse(JSON.stringify(boxes.filter(b=>b.presentation&&!b.hidden)
            .sort((a,b)=>(b.background||0)-(a.background||0))));
        for(const box of visible.filter(b=>b.maxclass==='jsui'&&b.filename==='cmpe_xy.js')){
            const calls=[],graphics={init(){},redraw(){}};
            for(const method of ['set_source_rgba','set_line_width','rectangle','rounded_rectangle','ellipse','fill','stroke','move_to','line_to','select_font_face','set_font_size','show_text'])
                graphics[method]=(...args)=>calls.push({method,args});
            const xy=vm.createContext({box:{rect:[0,0,box.presentation_rect[2],box.presentation_rect[3]]},mgraphics:graphics,outlet(){}});
            vm.runInContext(fs.readFileSync(path.join(root,'cmpe_xy.js'),'utf8'),xy,{filename:'cmpe_xy.js'});
            if(box.xy)xy.set(...box.xy);xy.paint();box.paintCalls=calls;
        }
        return{mode,label,boxes:visible,waveform,durationMs:b?1000*b.frames/b.sr:0,
            provenance:(mode===0||mode===4?'Production finite renderer, included demo WAVs, 48000 Hz, seeded random 91':'Stopped live mode; no native DSP executed')+'; no audio hardware queried'+(detail?'; '+detail:'')};
    }
    context.loadbang();
    if(mode===0){
        until(()=>context.loading.some(Boolean));
        stages.push(snapshot('Loading samples','Captured after the real demo-load requests; disk completion simulated'));
    }
    until(()=>context.sources.every(Boolean));
    if(typeof context.CMPEAudioState==='function')until(()=>!context.CMPEAudioState().tasks.boot);
    context.samplerate(48000);context.dspstate(1);context.mode(mode);
    if(mode===0||mode===4){
        context.newpiece();
        if(mode===0){
            until(()=>context.state==='rendering');
            stages.push(snapshot('Checking silence','Captured before the first production silence-scan task'));
            until(()=>context.state==='rendering'&&context.renderFrame>0&&context.renderFrame<context.renderHalf);
            stages.push(snapshot('Rendering audio','Progress and partial waveform calculated by the production renderer'));
        }
        until(()=>context.state==='ready'&&context.outputReady);
        if(mode===0)stages.push(snapshot('Ready to play','Captured after complete production rendering'));
    }
    // The five overview stills show audio off. The state sheet uses simulated
    // DSP state only to exercise real transport transitions, with no fake meters.
    context.dspstate(0);
    reports.push(snapshot(['APG','ISJS','Many','RMHS','SIOE'][mode]));
    if(mode===0){
        context.dspstate(1);context.play();until(()=>context.state==='playing');
        stages.push(snapshot('Playing','Transport-start callback simulated; position is the actual start; no native audio or meters'));
        context.stop();until(()=>context.state==='ready');
        context.repeats(0,Math.min(20,context.repetitions[0]+1));
        stages.push(snapshot('Settings changed','Real repeats edit retains the old waveform and marks it out of date'));
        context.newpiece();until(()=>context.state==='rendering'&&context.renderFrame>0);
        context.stop();
        stages.push(snapshot('Generation canceled','Real stop during production rendering; partial output is incomplete'));
    }
}
process.stdout.write(JSON.stringify({modes:reports,stages}));
'''

capture = json.loads(subprocess.check_output(["node", "-e", NODE, str(ROOT)], text=True))
states = capture["modes"]
stages = capture["stages"]


def font(size, bold=False):
    custom = os.environ.get("CMPE_PREVIEW_FONT_BOLD" if bold else "CMPE_PREVIEW_FONT")
    candidates = [custom] if custom else []
    candidates.extend([
        "/usr/share/fonts/truetype/liberation2/LiberationSans-" + ("Bold" if bold else "Regular") + ".ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-" + ("Bold" if bold else "Regular") + ".ttf",
        "/System/Library/Fonts/Supplemental/" + ("Arial Bold.ttf" if bold else "Arial.ttf"),
        "/Library/Fonts/" + ("Arial Bold.ttf" if bold else "Arial.ttf"),
        "C:/Windows/Fonts/" + ("arialbd.ttf" if bold else "arial.ttf"),
    ])
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return ImageFont.truetype(candidate, round(size * SCALE))
    raise RuntimeError("Set CMPE_PREVIEW_FONT and CMPE_PREVIEW_FONT_BOLD to Arial-compatible TTF paths")


def color(value):
    return tuple(round(255 * n) for n in value[:3])


def rgba(value):
    return color(value) + (round(255 * value[3]) if len(value) > 3 else 255,)


def paint_xy(draw, box, x, y):
    """Replay the real jsui paint routine without running a native Max UI."""
    ink, thickness, text_size = (0, 0, 0), SCALE, 17
    shapes, lines, cursor = [], [], (0, 0)
    for call in box.get("paintCalls", []):
        method, args = call["method"], call["args"]
        if method == "set_source_rgba":
            ink = color(args) + (round(args[3] * 255),)
        elif method == "set_line_width":
            thickness = max(1, round(args[0] * SCALE))
        elif method in ("rectangle", "rounded_rectangle", "ellipse"):
            a, b, w, h = args[:4]
            shapes.append((method, (x + a * SCALE, y + b * SCALE,
                                    x + (a + w) * SCALE, y + (b + h) * SCALE),
                           round(args[4] * SCALE) if len(args) > 4 else 0))
        elif method == "move_to":
            cursor = (x + args[0] * SCALE, y + args[1] * SCALE)
        elif method == "line_to":
            end = (x + args[0] * SCALE, y + args[1] * SCALE)
            lines.append((cursor, end)); cursor = end
        elif method in ("fill", "stroke"):
            style = {"fill": ink} if method == "fill" else {"outline": ink, "width": thickness}
            for shape, bounds, radius in shapes:
                if shape == "ellipse": draw.ellipse(bounds, **style)
                elif shape == "rounded_rectangle": draw.rounded_rectangle(bounds, radius=radius, **style)
                else: draw.rectangle(bounds, **style)
            for start, end in lines: draw.line((*start, *end), fill=ink, width=thickness)
            shapes, lines = [], []
        elif method == "set_font_size":
            text_size = args[0]
        elif method == "show_text":
            draw.text(cursor, str(args[0]), font=font(text_size), fill=ink, anchor="ls")
        elif method != "select_font_face":
            raise RuntimeError("Unsupported XY painting method: " + method)


def wrap(text, draw, typeface, width):
    lines = []
    for paragraph in str(text).split("\n"):
        line = ""
        for word in paragraph.split(" "):
            candidate = (line + " " + word).strip()
            if line and draw.textlength(candidate, font=typeface) > width:
                lines.append(line)
                line = word
            else:
                line = candidate
        lines.append(line)
    return lines


issues, outputs, rendered = [], [], {}


def render_state(state):
    mode = state["mode"]
    name = ["APG", "ISJS", "Many", "RMHS", "SIOE"][mode]
    canvas = Image.new("RGB", (WIDTH * SCALE, (HEIGHT + FOOTER) * SCALE), color(PATCH.get("bglockedcolor", PATCH.get("bgcolor", [1, 1, 1, 1]))))
    draw = ImageDraw.Draw(canvas, "RGBA")
    for box in state["boxes"]:
        x, y, w, h = [round(n * SCALE) for n in box["presentation_rect"]]
        kind = box["maxclass"]
        fs = box.get("fontsize", 17)
        f = font(fs, box.get("fontface") == 1)
        is_on = kind == "textbutton" and box.get("mode") == 1 and box.get("value", 0)
        fg = rgba(box.get("textoncolor" if is_on else "textcolor", [.04, .04, .04, 1]))
        bg = rgba(box.get("bgoncolor" if is_on else "bgcolor", [1, 1, 1, 1]))
        border = rgba(box.get("bordercolor", [.796, .835, .867, 1]))
        # textbutton's documented active=0 state is visibly grayed out. The
        # runtime supplies explicit colors for other ignored/locked widgets.
        if kind == "textbutton" and box.get("active", 1) == 0:
            fg = tuple(round(.5 * channel + .5 * 180) for channel in fg[:3]) + (fg[3],)
            bg = tuple(round(.5 * channel + .5 * 235) for channel in bg[:3]) + (bg[3],)
        if kind in ["textbutton", "number", "flonum", "umenu", "toggle"]:
            radius = round(box.get("rounded", 0) * SCALE)
            draw.rounded_rectangle((x, y, x + w - 1, y + h - 1), radius=radius, fill=bg, outline=border, width=SCALE)
        if kind == "textbutton":
            label = box.get("texton" if is_on else "text", "")
            if draw.textlength(label, font=f) > w - 12 * SCALE:
                issues.append([state["label"], box["id"], "button text width", label])
            draw.text((x + w / 2, y + h / 2), label, font=f, fill=fg, anchor="mm")
        elif kind == "comment":
            if "bgcolor" in box and bg[3]:
                draw.rectangle((x, y, x + w - 1, y + h - 1), fill=bg)
            lines = wrap(box.get("text", ""), draw, f, w - 6 * SCALE)
            step = round((fs + 1) * SCALE)
            if len(lines) * step > h:
                issues.append([state["label"], box["id"], "comment height", lines])
            for i, line in enumerate(lines):
                draw.text((x + 3 * SCALE, y + 3 * SCALE + i * step), line, font=f, fill=fg)
        elif kind in ["number", "flonum"]:
            value = box.get("value", 0)
            label = f"{value:.2f}".rstrip("0").rstrip(".") if isinstance(value, (int, float)) else str(value)
            draw.text((x + 3 * SCALE, y + h / 2), label, font=f, fill=fg, anchor="lm")
        elif kind == "umenu":
            items = [item for item in box.get("items", []) if item != ","]
            selected = int(box.get("value", 0))
            label = str(items[selected]) if 0 <= selected < len(items) else ""
            if draw.textlength(label, font=f) > w - 32 * SCALE:
                issues.append([state["label"], box["id"], "menu text width", label])
            draw.text((x + 7 * SCALE, y + h / 2), label, font=f, fill=fg, anchor="lm")
            draw.polygon([(x + w - 18 * SCALE, y + h / 2 - 3 * SCALE), (x + w - 8 * SCALE, y + h / 2 - 3 * SCALE), (x + w - 13 * SCALE, y + h / 2 + 4 * SCALE)], fill=fg)
        elif kind in ["waveform~", "scope~"]:
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=bg, outline=border, width=SCALE)
            grid = color(box.get("gridcolor", [.875, .902, .922, 1]))
            for i in range(1, 4):
                draw.line((x + i * w / 4, y, x + i * w / 4, y + h - 1), fill=grid, width=SCALE)
            draw.line((x, y + h / 2, x + w - 1, y + h / 2), fill=grid, width=SCALE)
            if kind == "waveform~" and state["waveform"]:
                channel = 1 if box.get("varname") == "wave_r" else 0
                bins = state["waveform"][channel]
                zoom = float(box.get("vzoom", 1))
                for i, (low, high) in enumerate(bins):
                    xpos = x + 2 * SCALE + i * (w - 4 * SCALE) / len(bins)
                    top = y + h / 2 - min(1, max(-1, high * zoom)) * (h / 2 - 3 * SCALE)
                    bottom = y + h / 2 - min(1, max(-1, low * zoom)) * (h / 2 - 3 * SCALE)
                    draw.line((xpos, top, xpos, bottom), fill=rgba(box.get("waveformcolor", box.get("fgcolor", box.get("textcolor", [0,0,0,1])))), width=SCALE)
                duration = state.get("durationMs", 0)
                line = box.get("line", -1)
                if isinstance(line, (int, float)) and duration > 0 and 0 <= line <= duration:
                    xpos = x + min(w - SCALE, max(SCALE, line / duration * w))
                    draw.line((xpos, y + SCALE, xpos, y + h - SCALE), fill=rgba(box.get("linecolor", [.1, .16, .21, 1])), width=2 * SCALE)
        elif kind == "jsui":
            paint_xy(draw, box, x, y)
        elif kind == "meter~":
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=bg, outline=border, width=SCALE)
        elif kind == "slider":
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=bg)
            progress = max(0, min(1, float(box.get("value", 0))))
            if progress:
                draw.rectangle((x, y, x + w * progress - 1, y + h - 1), fill=color(box.get("knobcolor", box.get("fgcolor", [0,0,0,1]))))
        elif kind == "panel":
            draw.rounded_rectangle((x, y, x + w - 1, y + h - 1), radius=round(box.get("rounded", 0) * SCALE), fill=bg,
                                   outline=border if box.get("border", 0) else None, width=SCALE)
    draw.rectangle((0, HEIGHT * SCALE, WIDTH * SCALE, (HEIGHT + FOOTER) * SCALE), fill=(235, 235, 235))
    draw.text((12 * SCALE, (HEIGHT + 11) * SCALE), "Interface preview · not a native Max screenshot · " + name + " · audio hardware not queried", font=font(14), fill=(50, 50, 50))
    return canvas


def save_image(canvas, filename, title, provenance):
    png = PngImagePlugin.PngInfo()
    png.add_text("Title", title)
    png.add_text("Description", "Layout and widget rendering approximation; not a native Max screenshot. " + provenance)
    output = OUT / filename
    canvas.save(output, pnginfo=png, optimize=True)
    outputs.append({"file": str(output.relative_to(ROOT)), "width": canvas.width, "height": canvas.height, "bytes": output.stat().st_size, "provenance": provenance})


for state in states:
    canvas = render_state(state)
    name = state["label"]
    rendered[name] = canvas
    save_image(canvas, name.lower() + "-interface-preview.png", "CMPE Variety Pack: " + name + " interface preview", state["provenance"])


def contact_sheet(items, filename, title, description, thumb_width, columns=2):
    margin, gap, heading, caption = 24, 24, 104, 36
    thumb_height = round(items[0][1].height * thumb_width / items[0][1].width)
    rows = (len(items) + columns - 1) // columns
    sheet = Image.new("RGB", (margin * 2 + columns * thumb_width + (columns - 1) * gap,
                              heading + rows * (caption + thumb_height + gap) + margin), (242, 245, 247))
    draw = ImageDraw.Draw(sheet)
    draw.text((margin, 20), title, font=font(17, True), fill=(27, 41, 54))
    draw.text((margin, 64), "Interface preview · not a native Max screenshot · controller simulation", font=font(9), fill=(82, 103, 117))
    for index, (label, frame) in enumerate(items):
        x = margin + (index % columns) * (thumb_width + gap)
        y = heading + (index // columns) * (caption + thumb_height + gap)
        draw.text((x, y), label, font=font(10, True), fill=(27, 41, 54))
        sheet.paste(frame.resize((thumb_width, thumb_height), Image.Resampling.LANCZOS), (x, y + caption))
    save_image(sheet, filename, title, description)


contact_sheet([(state["label"], rendered[state["label"]]) for state in states],
              "all-instruments-overview.png", "CMPE · all five instruments",
              "All five complete presentation views. " + "; ".join(state["provenance"] for state in states), WIDTH)

# Show the genuine output/transport/status region for each captured APG stage.
# The bounds come from the patch itself, so changes to layout cannot silently
# crop a status badge or progress strip out of the review sheet.
interest = {"output_label", "activity_heading", "state_badge", "feedback_panel", "play_button", "stop_button", "new_button", "progress", "render_info", "status", "wave_l", "wave_r", "selection_info", "time", "wave_scale"}
review_boxes = [box for box in stages[0]["boxes"] if box.get("varname", box["id"]) in interest]
top = max(0, min(box["presentation_rect"][1] for box in review_boxes) - 10)
bottom = min(HEIGHT, max(box["presentation_rect"][1] + box["presentation_rect"][3] for box in review_boxes) + 10)
state_items = [(state["label"], render_state(state).crop((0, round(top * SCALE), WIDTH * SCALE, round(bottom * SCALE)))) for state in stages]
contact_sheet(state_items, "apg-feedback-states.png", "APG · visible feedback through one session",
              "Actual production-controller state transitions; fake clock and simulated I/O/audio-start callbacks; no native MSP execution. " + "; ".join(state["provenance"] for state in stages), WIDTH)

for state in states + stages:
    visible = state["boxes"]
    for i, a in enumerate(visible):
        ax, ay, aw, ah = a["presentation_rect"]
        assert 0 <= ax and 0 <= ay and ax + aw <= WIDTH and ay + ah <= HEIGHT, a["id"]
        for b in visible[i + 1:]:
            if (a["maxclass"] == "panel" and a.get("background")) or (b["maxclass"] == "panel" and b.get("background")):
                continue
            bx, by, bw, bh = b["presentation_rect"]
            assert not (ax < bx + bw and bx < ax + aw and ay < by + bh and by < ay + ah), (state["mode"], a["id"], b["id"])
if issues:
    raise RuntimeError("Text fitting errors: " + json.dumps(issues))
print(json.dumps({"outputs": outputs, "text_fit": "passed", "visible_bounds_and_overlap": "passed"}, indent=2))
