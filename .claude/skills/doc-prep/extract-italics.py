#!/usr/bin/env python3
"""Extract inline italic text with surrounding context from a LibreOffice XHTML
export (the `XHTML Writer File` filter, whose styles carry `font-style:italic`
CSS classes). Filters out structural italics (italic paragraphs such as headings
and block quotes) and footnote superscripts, and merges the spans LibreOffice
fragments a single italic run into at accent/quote boundaries, outputting only
the ad-hoc emphasis italics that must be transferred to AsciiDoc."""

import re
import sys

def extract_italics(xhtml_path):
    with open(xhtml_path, "r") as f:
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

        # collect every emphasis-span range in this paragraph, in document order
        spans = []
        for cls in emphasis_classes:
            for sm in re.finditer(
                rf'<span class="{cls}">(.*?)</span>', p_content, re.DOTALL
            ):
                spans.append((sm.start(), sm.end(), strip_tags(sm.group(1))))
        spans.sort()

        # merge spans separated only by empty/whitespace text — LibreOffice fragments
        # one italic run into several spans at accent/quote boundaries
        merged = []
        for start, end, text in spans:
            if merged and strip_tags(p_content[merged[-1][1] : start]).strip() == "":
                ps, _, pt = merged[-1]
                merged[-1] = (ps, end, pt + text)
            else:
                merged.append((start, end, text))

        for start, end, text in merged:
            italic_text = text.strip()
            if not italic_text:
                continue
            before_ctx = " ".join(strip_tags(p_content[:start]).split()[-8:])
            after_ctx = " ".join(strip_tags(p_content[end:]).split()[:8])
            results.append((before_ctx, italic_text, after_ctx))

    print(f"Found {len(results)} inline italic(s)\n")
    for i, (before, text, after) in enumerate(results):
        print(f"{i + 1:3d}. ...{before} __{text}__ {after}...")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <xhtml-file>", file=sys.stderr)
        sys.exit(1)
    extract_italics(sys.argv[1])
