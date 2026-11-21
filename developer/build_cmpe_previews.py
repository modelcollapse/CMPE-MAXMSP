"""Render reproducible CMPE interface previews, not native Max screenshots.

Run from any directory with Python 3, Pillow, and Node.js installed:
    python3 developer/build_cmpe_previews.py

The current maxpat supplies geometry, colors, and font sizes. The shipped
controller supplies visible objects and text. APG and SIOE waveforms are rendered
from the included demo WAVs by the actual shipped controller/renderer at 48 kHz.
Live modes are shown stopped; this script neither executes native MSP objects
nor invents scope traces. Font rasterization and Max widget drawing are
approximations. A visible footer and PNG metadata retain that distinction.
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
WIDTH, HEIGHT, FOOTER = 840, 866, 40

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
const reports=[];
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
            }else if(selector==='text')this.text=String(args[0]);
            else if(['bgcolor','bgoncolor','textcolor','textoncolor','textovercolor','ignoreclick'].includes(selector))this[selector]=args.length>1?args:args[0];
            else if(selector==='clear'&&this.maxclass==='umenu')this.items=[];
            else if(selector==='append'&&this.maxclass==='umenu')this.items.push(args[0]);
            else if(selector==='name'){names.set(this.varname,args[0]);buffers.set(args[0],fresh());}
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
    context.loadbang();until(()=>context.sources.every(Boolean));context.samplerate(48000);context.dspstate(1);context.mode(mode);
    let waveform=null;
    if(mode===0||mode===4){
        context.newpiece();until(()=>context.state==='ready'&&context.outputReady);
        const b=buffers.get(context.outputName),bins=760;
        waveform=b.data.map(ch=>Array.from({length:bins},(_,i)=>{
            const first=Math.floor(i*ch.length/bins),last=Math.floor((i+1)*ch.length/bins);let min=0,max=0;
            for(let n=first;n<last;n++){min=Math.min(min,ch[n]);max=Math.max(max,ch[n]);}
            return[min,max];
        }));
    }
    reports.push({mode,boxes:boxes.filter(b=>b.presentation&&!b.hidden),waveform,
        provenance:mode===0||mode===4?'Production finite renderer, included demo WAVs, 48000 Hz, seeded random 91':'Stopped live mode; no native DSP executed'});
}
process.stdout.write(JSON.stringify(reports));
'''

states = json.loads(subprocess.check_output(["node", "-e", NODE, str(ROOT)], text=True))


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


issues, outputs = [], []
for state in states:
    mode = state["mode"]
    name = ["APG", "ISJS", "Many", "RMHS", "SIOE"][mode]
    canvas = Image.new("RGB", (WIDTH * SCALE, (HEIGHT + FOOTER) * SCALE), "white")
    draw = ImageDraw.Draw(canvas)
    for box in state["boxes"]:
        x, y, w, h = [round(n * SCALE) for n in box["presentation_rect"]]
        kind = box["maxclass"]
        fs = box.get("fontsize", 17)
        f = font(fs, box.get("fontface") == 1)
        fg = color(box.get("textcolor", [.04, .04, .04, 1]))
        bg = color(box.get("bgcolor", [1, 1, 1, 1]))
        if kind in ["textbutton", "number", "flonum", "umenu", "toggle"]:
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=bg, outline=(150, 150, 150), width=SCALE)
        if kind == "textbutton":
            label = box.get("text", "")
            if draw.textlength(label, font=f) > w - 12 * SCALE:
                issues.append([name, box["id"], "button text width"])
            draw.text((x + w / 2, y + h / 2), label, font=f, fill=fg, anchor="mm")
        elif kind == "comment":
            lines = wrap(box.get("text", ""), draw, f, w - 6 * SCALE)
            step = round((fs + 1) * SCALE)
            if len(lines) * step > h:
                issues.append([name, box["id"], "comment height", lines])
            for i, line in enumerate(lines):
                draw.text((x + 3 * SCALE, y + 3 * SCALE + i * step), line, font=f, fill=fg)
        elif kind in ["number", "flonum"]:
            value = box.get("value", 0)
            label = f"{value:.2f}".rstrip("0").rstrip(".") if isinstance(value, (int, float)) else str(value)
            draw.text((x + 3 * SCALE, y + h / 2), label, font=f, fill=fg, anchor="lm")
        elif kind == "umenu":
            items = [item for item in box.get("items", []) if item != ","]
            selected = int(box.get("value", 0))
            draw.text((x + 7 * SCALE, y + h / 2), str(items[selected]) if selected < len(items) else "", font=f, fill=fg, anchor="lm")
            draw.polygon([(x + w - 18 * SCALE, y + h / 2 - 3 * SCALE), (x + w - 8 * SCALE, y + h / 2 - 3 * SCALE), (x + w - 13 * SCALE, y + h / 2 + 4 * SCALE)], fill=fg)
        elif kind in ["waveform~", "scope~"]:
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=bg, outline=(150, 150, 150), width=SCALE)
            for i in range(1, 4):
                draw.line((x + i * w / 4, y, x + i * w / 4, y + h - 1), fill=(210, 210, 210), width=SCALE)
            draw.line((x, y + h / 2, x + w - 1, y + h / 2), fill=(140, 140, 140), width=SCALE)
            if kind == "waveform~" and state["waveform"]:
                channel = 1 if box.get("varname") == "wave_r" else 0
                bins = state["waveform"][channel]
                for i, (low, high) in enumerate(bins):
                    xpos = x + 2 * SCALE + i * (w - 4 * SCALE) / len(bins)
                    draw.line((xpos, y + h / 2 - high * (h / 2 - 3 * SCALE), xpos, y + h / 2 - low * (h / 2 - 3 * SCALE)), fill=fg, width=SCALE)
        elif kind == "jsui":
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=(242, 242, 242), outline=(150, 150, 150), width=SCALE)
            draw.line((x + w / 2, y, x + w / 2, y + h - 1), fill=(190, 190, 190), width=SCALE)
            draw.line((x, y + h / 2, x + w - 1, y + h / 2), fill=(190, 190, 190), width=SCALE)
            draw.ellipse((x + w / 2 - 7 * SCALE, y + h / 2 - 7 * SCALE, x + w / 2 + 7 * SCALE, y + h / 2 + 7 * SCALE), fill=(15, 15, 15))
            draw.text((x + 10 * SCALE, y + 8 * SCALE), "DENSITY 50%", font=font(17), fill=fg)
            draw.text((x + 10 * SCALE, y + h - 28 * SCALE), "POSITION 50%", font=font(17), fill=fg)
        elif kind == "meter~":
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=(40, 40, 40), outline=(150, 150, 150), width=SCALE)
        elif kind == "slider":
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=(235, 235, 235))
            progress = max(0, min(1, float(box.get("value", 0))))
            if progress:
                draw.rectangle((x, y, x + w * progress - 1, y + h - 1), fill=(20, 20, 20))
        elif kind == "panel":
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=bg)
    draw.rectangle((0, HEIGHT * SCALE, WIDTH * SCALE, (HEIGHT + FOOTER) * SCALE), fill=(235, 235, 235))
    draw.text((12 * SCALE, (HEIGHT + 11) * SCALE), name + " interface preview from patch data; not a native Max screenshot.", font=font(14), fill=(50, 50, 50))
    png = PngImagePlugin.PngInfo()
    png.add_text("Title", "CMPE Variety Pack: " + name + " interface preview")
    png.add_text("Description", "Layout and widget rendering approximation; not a native Max screenshot. " + state["provenance"])
    output = OUT / (name.lower() + "-interface-preview.png")
    canvas.save(output, pnginfo=png, optimize=True)
    outputs.append({"file": str(output.relative_to(ROOT)), "width": canvas.width, "height": canvas.height, "bytes": output.stat().st_size, "provenance": state["provenance"]})

for state in states:
    visible = state["boxes"]
    for i, a in enumerate(visible):
        ax, ay, aw, ah = a["presentation_rect"]
        assert 0 <= ax and 0 <= ay and ax + aw <= WIDTH and ay + ah <= HEIGHT, a["id"]
        for b in visible[i + 1:]:
            bx, by, bw, bh = b["presentation_rect"]
            assert not (ax < bx + bw and bx < ax + aw and ay < by + bh and by < ay + ah), (state["mode"], a["id"], b["id"])
if issues:
    raise RuntimeError("Text fitting errors: " + json.dumps(issues))
print(json.dumps({"outputs": outputs, "text_fit": "passed", "visible_bounds_and_overlap": "passed"}, indent=2))
