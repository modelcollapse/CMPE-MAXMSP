"""Draw the actual five M4L Presentation layouts without inventing host audio.

These are interface previews, not screenshots from native Ableton Live/Max.
Geometry, colors, labels, initial values and the XY pad paint come from the
generated files. Waveforms, meters and scopes are empty, as before playback.
"""

from pathlib import Path
import json
import os
import subprocess

from PIL import Image, ImageDraw, ImageFont, PngImagePlugin


ROOT = Path(__file__).resolve().parent.parent
DEVICES = ROOT / "max-for-live"
OUT = DEVICES / "previews"
SCALE = 2
WIDTH, HEIGHT, FOOTER = 1100, 169, 30
NAMES = ["APG", "ISJS", "Many", "RMHS", "SIOE"]


def font(size, bold=False):
    candidates = [os.environ.get("CMPE_PREVIEW_FONT_BOLD" if bold else "CMPE_PREVIEW_FONT")]
    candidates += [
        "/usr/share/fonts/truetype/liberation2/LiberationSans-" + ("Bold" if bold else "Regular") + ".ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-" + ("Bold" if bold else "Regular") + ".ttf",
        "/System/Library/Fonts/Supplemental/" + ("Arial Bold.ttf" if bold else "Arial.ttf"),
    ]
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return ImageFont.truetype(candidate, round(size * SCALE))
    raise RuntimeError("Set CMPE_PREVIEW_FONT and CMPE_PREVIEW_FONT_BOLD to Arial-compatible font files.")


def color(value):
    return tuple(round(255 * n) for n in value[:3])


def wrap(text, draw, typeface, width):
    result = []
    for paragraph in str(text).split("\n"):
        line = ""
        for word in paragraph.split():
            candidate = (line + " " + word).strip()
            if line and draw.textlength(candidate, font=typeface) > width:
                result.append(line)
                line = word
            else:
                line = candidate
        result.append(line)
    return result


def xy_calls(width, height):
    code = r'''
const fs=require('fs'),vm=require('vm');
const calls=[],mgraphics={init(){},redraw(){}};
for(const method of ['set_source_rgba','set_line_width','rectangle','rounded_rectangle','ellipse','fill','stroke','move_to','line_to','select_font_face','set_font_size','show_text'])
 mgraphics[method]=(...args)=>calls.push({method,args});
const ctx=vm.createContext({box:{rect:[0,0,Number(process.argv[2]),Number(process.argv[3])]},mgraphics,outlet(){}});
vm.runInContext(fs.readFileSync(process.argv[1],'utf8'),ctx);ctx.set(0.5,0.5);ctx.paint();
process.stdout.write(JSON.stringify(calls));
'''
    return json.loads(subprocess.check_output(["node", "-e", code, str(DEVICES / "cmpe_xy.js"), str(width), str(height)], text=True))


def paint_xy(draw, calls, x, y):
    ink, thickness, text_size = (0, 0, 0), SCALE, 17
    shapes, lines, cursor = [], [], (0, 0)
    for call in calls:
        method, args = call["method"], call["args"]
        if method == "set_source_rgba":
            ink = color(args) + (round(args[3] * 255),)
        elif method == "set_line_width":
            thickness = max(1, round(args[0] * SCALE))
        elif method in ("rectangle", "rounded_rectangle", "ellipse"):
            a, b, w, h = args[:4]
            shapes.append((method, (x + a * SCALE, y + b * SCALE, x + (a + w) * SCALE, y + (b + h) * SCALE)))
        elif method == "move_to":
            cursor = (x + args[0] * SCALE, y + args[1] * SCALE)
        elif method == "line_to":
            end = (x + args[0] * SCALE, y + args[1] * SCALE)
            lines.append((cursor, end))
            cursor = end
        elif method in ("fill", "stroke"):
            style = {"fill": ink} if method == "fill" else {"outline": ink, "width": thickness}
            for shape, bounds in shapes:
                if shape == "ellipse":
                    draw.ellipse(bounds, **style)
                else:
                    draw.rectangle(bounds, **style)
            for start, end in lines:
                draw.line((*start, *end), fill=ink, width=thickness)
            shapes, lines = [], []
        elif method == "set_font_size":
            text_size = args[0]
        elif method == "show_text":
            draw.text(cursor, str(args[0]), font=font(text_size), fill=ink, anchor="ls")
        elif method != "select_font_face":
            raise RuntimeError("Unsupported paint method " + method)


def render(name):
    patch = json.loads((DEVICES / f"CMPE_{name}.maxpat").read_text())["patcher"]
    canvas = Image.new("RGB", (WIDTH * SCALE, (HEIGHT + FOOTER) * SCALE), color(patch["bglockedcolor"]))
    draw = ImageDraw.Draw(canvas, "RGBA")
    boxes = [item["box"] for item in patch["boxes"] if item["box"].get("presentation") and not item["box"].get("hidden")]
    boxes.sort(key=lambda b: -(b.get("background", 0)))
    issues = []
    for box in boxes:
        x, y, w, h = [round(n * SCALE) for n in box["presentation_rect"]]
        kind, fs = box["maxclass"], box.get("fontsize", 11)
        f = font(fs, box.get("fontface") == 1)
        fg = color(box.get("textcolor", [0.106, 0.161, 0.212, 1]))
        bg = color(box.get("bgcolor", [1, 1, 1, 1]))
        border = color(box.get("bordercolor", [0.796, 0.835, 0.867, 1]))
        initial = box.get("saved_attribute_attributes", {}).get("valueof", {}).get("parameter_initial", [0])
        value = initial[0] if initial else 0
        if kind in ["textbutton", "number", "flonum", "umenu", "toggle"]:
            draw.rounded_rectangle((x, y, x + w - 1, y + h - 1), radius=round(box.get("rounded", 0) * SCALE),
                                   fill=bg, outline=border, width=SCALE)
        if kind == "textbutton":
            label = box.get("text", "")
            if draw.textlength(label, font=f) > w - 8 * SCALE:
                issues.append((box["id"], "button label too wide"))
            draw.text((x + w / 2, y + h / 2), label, font=f, fill=fg, anchor="mm")
        elif kind == "comment":
            lines = wrap(box.get("text", ""), draw, f, w - 4 * SCALE)
            step = (fs + 1) * SCALE
            if len(lines) * step > h:
                issues.append((box["id"], "comment too tall", lines))
            for i, line in enumerate(lines):
                draw.text((x + 2 * SCALE, y + 1 * SCALE + i * step), line, font=f, fill=fg)
        elif kind in ["number", "flonum"]:
            label = str(value) if not isinstance(value, (int, float)) else f"{value:.2f}".rstrip("0").rstrip(".")
            if label == "":
                label = "0"
            draw.text((x + 4 * SCALE, y + h / 2), label, font=f, fill=fg, anchor="lm")
        elif kind == "umenu":
            items = [v for v in box.get("items", []) if v != ","]
            label = items[int(value)] if 0 <= int(value) < len(items) else ""
            draw.text((x + 6 * SCALE, y + h / 2), label, font=f, fill=fg, anchor="lm")
            draw.polygon([(x + w - 16 * SCALE, y + h / 2 - 2 * SCALE),
                          (x + w - 8 * SCALE, y + h / 2 - 2 * SCALE),
                          (x + w - 12 * SCALE, y + h / 2 + 3 * SCALE)], fill=fg)
        elif kind in ["waveform~", "scope~"]:
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=bg, outline=border, width=SCALE)
            grid = color(box.get("gridcolor", [.9, .93, .94, 1]))
            for i in range(1, 4):
                draw.line((x + i * w / 4, y, x + i * w / 4, y + h - 1), fill=grid, width=SCALE)
            draw.line((x, y + h / 2, x + w - 1, y + h / 2), fill=grid, width=SCALE)
        elif kind == "jsui":
            paint_xy(draw, xy_calls(w // SCALE, h // SCALE), x, y)
        elif kind in ["slider", "panel", "meter~"]:
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill=bg)
    draw.rectangle((0, HEIGHT * SCALE, WIDTH * SCALE, (HEIGHT + FOOTER) * SCALE), fill=(229, 236, 240))
    draw.text((10 * SCALE, (HEIGHT + 8) * SCALE),
              f"{name} interface preview · Native Live verification pending · No native audio or host screenshot simulated",
              font=font(11), fill=(70, 87, 102))
    if issues:
        raise RuntimeError(f"{name} text fit: {issues}")
    meta = PngImagePlugin.PngInfo()
    meta.add_text("Title", f"CMPE {name} Max for Live interface preview")
    meta.add_text("Description", "Generated from the actual device Presentation geometry and initial parameter values. "
                  "The XY pad is painted by the shipped cmpe_xy.js. Waveforms and scopes are empty. "
                  "This is not a native Max or Ableton Live screenshot; native verification is pending.")
    path = OUT / f"{name.lower()}-interface-preview.png"
    canvas.save(path, pnginfo=meta, optimize=True)
    return canvas, path


def main():
    OUT.mkdir(exist_ok=True)
    images, paths = [], []
    for name in NAMES:
        image, path = render(name)
        images.append(image)
        paths.append(path)
    gap = 12 * SCALE
    overview = Image.new("RGB", (WIDTH * SCALE, sum(image.height for image in images) + gap * (len(images) - 1)), (204, 214, 221))
    y = 0
    for image in images:
        overview.paste(image, (0, y))
        y += image.height + gap
    overview_path = OUT / "all-devices-overview.png"
    overview.save(overview_path, optimize=True)
    paths.append(overview_path)
    print(json.dumps({"text_fit": "passed", "native_host_screenshot": False,
                     "files": [{"path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size} for path in paths]}, indent=2))


if __name__ == "__main__":
    main()
