#!/usr/bin/env python3
"""Extract inline italic text with surrounding context from an HTML file
exported by LibreOffice. Filters out structural italics (block quotes,
headings, etc.) and footnote superscripts, outputting only ad-hoc
emphasis italics that need to be manually transferred to AsciiDoc."""

import re
import sys

def extract_italics(html_path):
    with open(html_path, "r") as f:
        content = f.read()

    # find all CSS classes that have font-style:italic
    italic_classes = set(
        re.findall(r"\.([A-Z][A-Za-z0-9]+)\s*\{[^}]*font-style:italic", content)
    )

    # separate paragraph-level (P*) from span-level (T*) italic classes
    italic_p_classes = {c for c in italic_classes if c.startswith("P")}
    italic_t_classes = {c for c in italic_classes if c.startswith("T")}

    # filter out footnote superscript classes (have vertical-align:super)
    footnote_classes = set()
    for cls in italic_t_classes:
        m = re.search(rf"\.{cls}\s*\{{([^}}]+)\}}", content)
        if m and "vertical-align:super" in m.group(1):
            footnote_classes.add(cls)

    emphasis_classes = italic_t_classes - footnote_classes

    def strip_tags(s):
        return re.sub(r"<[^>]+>", "", s)

    results = []
    for m in re.finditer(r'<p class="(\w+)"[^>]*>(.*?)</p>', content, re.DOTALL):
        p_class = m.group(1)
        if p_class in italic_p_classes:
            continue
        p_content = m.group(2)

        for cls in emphasis_classes:
            for sm in re.finditer(
                rf'<span class="{cls}">(.*?)</span>', p_content, re.DOTALL
            ):
                italic_text = strip_tags(sm.group(1)).strip()
                if not italic_text:
                    continue

                before_text = strip_tags(p_content[: sm.start()])
                words_before = before_text.split()[-8:]
                before_ctx = " ".join(words_before)

                after_text = strip_tags(p_content[sm.end() :])
                words_after = after_text.split()[:8]
                after_ctx = " ".join(words_after)

                results.append((before_ctx, italic_text, after_ctx))

    print(f"Found {len(results)} inline italic(s)\n")
    for i, (before, text, after) in enumerate(results):
        print(f"{i + 1:3d}. ...{before} __{text}__ {after}...")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <html-file>", file=sys.stderr)
        sys.exit(1)
    extract_italics(sys.argv[1])
