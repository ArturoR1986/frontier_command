"""Render the documentary review and its numbered source inventory.

Requires ReportLab and pypdf in the bundled document runtime. This is a
documentation utility; it does not modify or exercise the game runtime.
"""
from pathlib import Path
import html
import json
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether,
)
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
MD = ROOT / "docs/DEVELOPER_AND_PLAYER_REVIEW.md"
OUT = ROOT / "output/pdf/rimworld-starcraft-development-review.pdf"
SOURCES = json.loads((ROOT / "docs/research/developer-review-sources.json").read_text(encoding="utf-8"))
BY_ID = {s["id"]: s for s in SOURCES}
body = MD.read_text(encoding="utf-8").split("<!-- sources -->")[0].rstrip()
ids = {int(n) for n in re.findall(r"\[\^(\d+)\]", body)}
assert ids == set(BY_ID), (ids, set(BY_ID))

# Keep Markdown searchable and all original URLs available without a PDF reader.
tail = "\n\n<!-- sources -->\n\n## Sources\n\nRetrieved 11 September 2026. Access notes distinguish complete articles, selected sections, and dynamic listings.\n\n"
for s in SOURCES:
    tail += f'{s["id"]}. **{s["author"]}.** [{s["title"]}]({s["url"]}). {s["date"]}. {s["context"]}. {s["access"]}\n\n'
for s in SOURCES:
    tail += f'[^{s["id"]}]: {s["author"]}, [{s["title"]}]({s["url"]}), {s["date"]}.\n'
MD.write_text(body + tail, encoding="utf-8")

styles = {
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.25, leading=14, spaceAfter=7, alignment=TA_LEFT),
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=21, leading=25, spaceAfter=16),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=15.5, leading=19, spaceAfter=10, keepWithNext=True),
    "h3": ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=11.5, leading=15, spaceBefore=7, spaceAfter=6, keepWithNext=True),
    "note": ParagraphStyle("note", fontName="Helvetica", fontSize=7.9, leading=10.1, spaceAfter=3),
    "source": ParagraphStyle("source", fontName="Helvetica", fontSize=8.9, leading=11.6, spaceAfter=8),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9.0, leading=11.6),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=10.25, leading=14, spaceAfter=5, leftIndent=11, firstLineIndent=-8),
}

def clean(text):
    return text.replace("\u2013", "-").replace("\u2014", "-").replace("\u2011", "-")

def markup(text):
    result = html.escape(clean(text))
    result = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", result)
    def cite(m):
        links = []
        for value in re.findall(r"\d+", m.group(0)):
            n = int(value)
            url = html.escape(BY_ID[n]["url"], quote=True)
            links.append(f'<link href="{url}" color="#333333">{n}</link>')
        return '<super>' + ', '.join(links) + '</super>'
    return re.sub(r"(?:\[\^\d+\])+", cite, result)

def para(text, kind="body"):
    return Paragraph(markup(text), styles[kind])

WIDTH = A4[0] - 96

def section_flow(text):
    result = []
    lines = text.strip().splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = [x.strip() for x in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r"[- :]+", x) for x in cells):
                    rows.append(cells)
                i += 1
            formatted = [[para(f"**{c}**" if r == 0 else c, "cell") for c in row] for r, row in enumerate(rows)]
            widths = [WIDTH * .21, WIDTH * .43, WIDTH * .36]
            table = Table(formatted, colWidths=widths, repeatRows=1, hAlign="LEFT")
            table.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eeeeee")),
                ("LINEBELOW", (0, 0), (-1, 0), .5, colors.HexColor("#777777")),
                ("LINEBELOW", (0, 1), (-1, -1), .25, colors.HexColor("#dddddd")),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]))
            result.extend([table, Spacer(1, 10)])
            continue
        if line.startswith("### "):
            result.append(para(line[4:], "h3"))
        elif line.startswith("## "):
            result.append(para(line[3:], "h2"))
        elif line.startswith("# "):
            result.append(para(line[2:], "title"))
        elif line.startswith("- "):
            result.append(para("- " + line[2:], "bullet"))
        else:
            result.append(para(line))
        i += 1
    refs = sorted({int(n) for n in re.findall(r"\[\^(\d+)\]", text)})
    if refs:
        result.append(Spacer(1, 9))
        for n in refs:
            s = BY_ID[n]
            short_author = s["author"].split(" / ")[0].split(";")[0]
            if len(short_author) > 60:
                short_author = "Steam Community reviewers" if "Steam" in short_author else "Blizzard Entertainment"
            note = f'{n}. {html.escape(short_author)}. <link href="{html.escape(s["url"], quote=True)}">{html.escape(clean(s["title"]))}</link>. {html.escape(s["date"])}.'
            result.append(Paragraph(note, styles["note"]))
    return result

def page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#555555"))
    canvas.drawRightString(A4[0] - 48, 23, str(doc.page))
    canvas.restoreState()

story = []
for index, section in enumerate(body.split("<!-- pagebreak -->")):
    if index:
        story.append(PageBreak())
    story.extend(section_flow(section))
story.extend([PageBreak(), para("Sources", "h2"), para("Retrieved 11 September 2026. Context and access notes identify the scope of each source.")])
for s in SOURCES:
    entry = f'<b>{s["id"]}. {html.escape(s["author"])}</b><br/><link href="{html.escape(s["url"], quote=True)}">{html.escape(clean(s["title"]))}</link>. {html.escape(s["date"])}.<br/>{html.escape(s["context"])}. {html.escape(s["access"])}'
    story.append(KeepTogether(Paragraph(entry, styles["source"])))

OUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=48, leftMargin=48,
                        topMargin=43, bottomMargin=40,
                        title="RimWorld and StarCraft: Development Lessons for Persistent Colony Conquest",
                        author="", pageCompression=1)
doc.build(story, onFirstPage=page_number, onLaterPages=page_number)
reader = PdfReader(str(OUT))
print(f"PDF: {len(reader.pages)} pages, {OUT.stat().st_size:,} bytes")
print(f"Body: {len(body.split()):,} whitespace-separated words; {len(SOURCES)} sources")
for i, page in enumerate(reader.pages, 1):
    text = page.extract_text()
    print(f"{i:2}: {len(text):5} characters | {text.splitlines()[0]}")
