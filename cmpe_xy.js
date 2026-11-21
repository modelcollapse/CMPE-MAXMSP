/* Local mouse pad for Joo Won Park's ISJS. No desktop-wide mouse capture. */
autowatch = 0;
inlets = 1;
outlets = 1;
mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;
var position = 0.5, density = 0.5;
function clamp(v) { return Math.max(0, Math.min(1, v)); }
function set(x, y) {
    position = clamp(Number(x)); density = clamp(Number(y));
    mgraphics.redraw();
}
function paint() {
    var w = box.rect[2] - box.rect[0], h = box.rect[3] - box.rect[1];
    var x = 18 + position * (w - 36), y = 18 + (1 - density) * (h - 36);
    mgraphics.set_source_rgba(0.95, 0.95, 0.95, 1);
    mgraphics.rectangle(0, 0, w, h); mgraphics.fill();
    mgraphics.set_source_rgba(0.55, 0.55, 0.55, 1); mgraphics.set_line_width(1);
    mgraphics.rectangle(1, 1, w - 2, h - 2); mgraphics.stroke();
    mgraphics.set_source_rgba(0.75, 0.75, 0.75, 1);
    mgraphics.move_to(x, 1); mgraphics.line_to(x, h - 1); mgraphics.stroke();
    mgraphics.move_to(1, y); mgraphics.line_to(w - 1, y); mgraphics.stroke();
    mgraphics.set_source_rgba(0.06, 0.06, 0.06, 1);
    mgraphics.ellipse(x - 7, y - 7, 14, 14); mgraphics.fill();
    mgraphics.select_font_face("Arial"); mgraphics.set_font_size(17);
    mgraphics.move_to(10, h - 10); mgraphics.show_text("POSITION  " + Math.round(position * 100) + "%");
    mgraphics.move_to(10, 23); mgraphics.show_text("DENSITY  " + Math.round(density * 100) + "%");
}
function update(x, y) {
    var w = box.rect[2] - box.rect[0], h = box.rect[3] - box.rect[1];
    position = clamp((x - 18) / Math.max(1, w - 36));
    density = clamp(1 - (y - 18) / Math.max(1, h - 36));
    outlet(0, "xy", position, density);
    mgraphics.redraw();
}
function onclick(x, y) { update(x, y); }
function ondrag(x, y) { update(x, y); }
function onresize() { mgraphics.redraw(); }
