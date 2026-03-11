## Italics

Italics are lost during the ODT → DocBook → AsciiDoc conversion. Use the HTML export from
Step 2 to identify where inline emphasis italics need to be restored.

### Scope: primarily free-standing, ad-hoc italics within paragraph text.

There are numerous structural items that are italicized in the source documents, stuff
like block quotes, headings, footnotes, letter salutations and signatures, etc. These are
all handled separately with their own markup rules. The italics restoration in this step
is primarily focused on free-standing, ad-hoc italics within the body text that don't have
a clear structural role.

### Extraction using python script:

Run the extraction script bundled with this skill:

```
python3 ${CLAUDE_SKILL_DIR}/extract-italics.py <html-file>
```

This outputs a numbered list of italic text with ~8 words of surrounding context on each
side, filtered to only inline emphasis (structural italics like block quotes and headings
are excluded). Use this list to add italic markup to the corresponding .adoc files.

### How to italicize:

**Italic syntax rules — use single `_` by default, double `__` only when required:**

Use single underscores `_text_` for normal cases where italics are at word boundaries:

```adoc
few in our present age know _what_ this Spirit is
```

Use double underscores `__text__` only when adjacent characters break word boundaries:

- Immediately before a footnote: `__immediately by a footnote.__^`
- Adjacent to an em-dash: `continuing in their evil ways,--__this__ is the ground`
- Inside backtick-quoted text: ``"`__It is the Spirit that quickens.__`"``
- Italics can span multiple lines with single underscores.

### Exceptions:

#### Book titles

If an italicized phrase is very obviously a book title, use a special wrapping format
instead of underscores, prepending `[.book-title]#` and appending `#`:

```adoc
He gave me [.book-title]#The Journal of George Fox# to read.
```

We wrap with book title format even if the title referenced is a shortening or alternate
phrasing instead the full book title, e.g.:

```adoc
We handed out more copies of [.book-title]#Barclay's Apology# at the meeting.
```

If the italicized text is a literary work that is not a book, or is a testimonial or
periodical, use normal italics by wrapping in underscores.

This is the only case where you are to identify and apply special formatting instead of
italics. The other items below are exceptions which should be skipped, but these book
titles should be handled with the wrapping book-title delimiter format.

#### SKIP: numbered paragraph labels:

If the italics list contains ordinal labels that appear at the BEGINNING of a line (First,
Second, Third / Firstly, Secondly, Thirdly / 1st, 2nd, 3rd / Spanish: Primero, Segundo,
Tercero), do **not** italicize them. These are numbered paragraph labels that will be
handled separately with additional markup in a later phase. Just skip them. This only
applies to single-word ordinals at line starts. Examples:

```adoc
1+++.+++ That there is no way of being saved from sin and [...]

2+++.+++ That there is no way of being saved by him, [...]
```

```adoc
First, the ten commandments given by Moses from Mount Horeb were [...]

Secondly, that covenant God found fault with because it was not [...]
```

#### SKIP: Introductory words in "discourse" sections:

There is special markup to wrap the identifiers of what we call "discourse" sections.
Common examples include question/answer sections like this, where the `Question:` and
`Answer:` (or same in spanish) begin each line.

```adoc
Question: What is the state and condition of all men by nature, [...]

Answer: A state of sin and darkness; a state of death and misery; [...]
```

These labels will may show up italicized, but should not be wrapped because they will be
handled by separate markup.

Another common form is for sections of labled discourse, like in a court trial transcript
or the relation of a conversation like this:

```adoc
Landlord.--So John, you are busy?

Tenant.--Yes, my landlord loves to see his tenants busy.
```

In that example the `Landlord.--` and `Tenant.--` labels may be italicized in the source,
but should NOT be wrapped with underscores because they will be handled by separate
markup.

#### SKIP: Letter wrapping items

There are numerous structural items related to embedded letters that are italicized in the
source, such as salutations, signatures, and contextual information (where/when the letter
was written). These should NOT be wrapped with underscores, as they will be handled
separately with their own markup rules in a later phase. Just skip them when applying
italics restoration. Example:

```adoc
Catherine Payton to Mary Peisley # <-- letter heading, skip

My Dear Friend, # <-- letter saluation, skip

It is not because I forgot thy [...]
[... letter content here ...]

Catherine Payton # <-- letter signature, skip

From Aylesbury Jail, 14th of 12th month, 1660 # <-- letter contextual information, skip
```

### Locating italics — do not assume chapter assignment:

For each italic in the list, search all chapter .adoc files for its surrounding context to
determine which file contains it. Do not assume chapter assignment based on the ordering
of the extract script output — the chapter boundaries don't necessarily align with the
numbered list.

### Verifying replacements:

After applying replacements, verify the expected number of changes were made. If using
Python `str.replace()` or similar, it will silently return the original string when the
target text is not found. After each batch of replacements to a file, check that the
number of successful replacements matches expectations. If any replacement silently fails,
investigate immediately — the text is likely in a different file or has different line
wrapping than expected.
