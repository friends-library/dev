---
name: doc-prep
description: Prepare a new document for publishing
---

Prepare a new document for the Friends Library publishing pipeline. This converts raw word
processing files (.odt) into AsciiDoc source files ready for further editing.

Do not use the AskUserQuestion tool during this skill. Just converse naturally with the
user to gather information and confirm steps.

## Step 0: Sync the database

Immediately run `just db-sync` in the background (using `run_in_background`) so the local
database has fresh production data. Do not wait for it to finish — proceed with gathering
inputs. Just make sure it has completed before any database queries in later steps.

## Step 1: Gather inputs

Ask the user:

- Where are the .odt source files?
- How many editions (1-3)?
- Language: English, Spanish, or both?

## Step 2: Convert ODT to DocBook XML

For each .odt file, convert to DocBook XML using LibreOffice's headless CLI. This produces
cleaner DocBook than pandoc (proper `<footnote>` tags, `<sect1>` elements, etc.):

```
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to xml:"DocBook File" --outdir <output-dir> <file>.odt
```

The output file will have the same basename with an `.xml` extension.

Also export each .odt file to HTML (needed later for restoring italics):

```
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to html --outdir <output-dir> <file>.odt
```

## Step 3: Convert DocBook XML to AsciiDoc

For each XML file, run:

```
fl convert <file>.xml
```

For Spanish documents, always pass `--skip-refs`:

```
fl convert <file>.xml --skip-refs
```

This produces an .adoc file.

## Step 4: Identify the document

Read the first ~50 lines of the generated .adoc file to infer the book title and author.
Then connect to the local PostgreSQL database (`flp_dev`, user `jared`, no password — see
`apps/api/.env` for connection details) and query existing friends and documents to:

- Guess the **friend name** and **friend slug** (e.g. "George Fox" → `george-fox`)
- Guess the **document title** and **document slug**

Slug conventions (from the database):

- Friend slugs: lowercased, hyphenated full name (e.g. `catherine-payton`)
- Document slugs: short descriptive slugs, not the full title (e.g. "A Plain Pathway" →
  `plain-pathway`)
- Filenames: Title_Case_With_Underscores (e.g. `Plain_Pathway`)
- Spanish slugs use unaccented characters (e.g. "Anécdotas" → `anecdotas`)

Query existing rows to compare conventions:

```
SELECT name, slug FROM friends WHERE lang = '<lang>' ORDER BY name;
SELECT title, slug, filename FROM documents d JOIN friends f ON d.friend_id = f.id WHERE f.lang = '<lang>' ORDER BY title;
```

Present your best guesses to the user and confirm before proceeding.

## Step 5: Create the document in the admin UI

Tell the user to open the admin website and create the document record. Provide them with
the confirmed title, slug, and filename. The filename follows the convention
`Title_Case_With_Underscores`, often including the author's name. Examples:

- "Journal of George Fox" → `Journal_of_George_Fox`
- "A Plain Pathway" → `Plain_Pathway`
- "Fruits of Retirement" → `Fruits_of_Retirement`
- "Andar en el Espíritu" → `Andar_en_el_Espiritu` (no accents in filenames)

Copy each value (title, slug, filename — for each document) to the clipboard one at a time
using `pbcopy`, so they're all in the user's clipboard history. Let the user know you've
put them all into their clipboard history.

Then output the link https://admin.friendslibrary.com/friends so the user can click it.

The document must exist in the database before the final `fl make` step will work. Remind
the user to also create at least one edition for the document in the admin UI. Wait for
the user to confirm they've created the record before proceeding.

## Step 6: Place the raw AsciiDoc file

Source files live at `{lang}/{friend-slug}/{doc-slug}/{editionType}/` where:

- `lang` is `en` or `es`
- `editionType` is `updated`, `modernized`, or `original`

For each generated .adoc file, create its target directory if needed (`mkdir -p`) and move
the file into it as `raw.adoc`.

**Checkpoint:** Pause and tell the user the raw files are in place. Ask if they want to
review the files or make a git commit before proceeding.

## Step 7: Clean up front matter

The raw.adoc will have the book title at the top and possibly other front matter before
the actual content begins. Clean it up:

1. Find the first line that looks like a chapter heading (e.g. "Chapter 1", "Chapter I",
   "Preface", "Prólogo", "Introduction", etc.)
2. Look at what's between the title and that heading. If there's a scripture verse or
   short quote that appears to be an epigraph, keep it and mark it up with proper AsciiDoc
   syntax. Look at other `01-*.adoc` files in the repo for examples of epigraph formatting
   before marking it up. The general format is:
   ```
   [quote.epigraph, , Reference]
   ____
   Quote text here.
   ____
   ```
3. Delete the title line and any other non-epigraph front matter.
4. The file should begin with either the epigraph block or the first `==` chapter heading.

**Checkpoint:** Pause and tell the user the front matter cleanup is done. Ask if they want
to review the changes or make a git commit before proceeding.

## Step 8: Fix footnote spacing

The LibreOffice conversion inserts a non-breaking space (U+00A0) after `footnote:[`. Fix
all occurrences in each raw.adoc file with:

```
perl -pi -e 's/footnote:\[\x{a0}/footnote:[/g' <file>.adoc
```

**Checkpoint:** Pause and let the user know the footnote cleanup is done. Ask if they want
to review or commit before proceeding.

## Step 9: Review chapter headings before chapterizing

The next step will split the raw.adoc into separate chapter files based on `==` headings.
Before that, help the user verify the headings are correct:

1. Find all lines starting with `== ` in each raw.adoc file.
2. Report the total number of chapters and list each heading.
3. Tell the user to manually review and fix any headings that aren't real chapter breaks
   (the conversion sometimes produces spurious `==` headings).
4. Wait for the user to confirm the headings look good before proceeding.

## Step 10: Chapterize

The user may have changed the headings during manual review, so re-scan each raw.adoc for
all `== ` lines before proceeding.

Determine the `chStart` value — this is the 1-based index of the first `==` heading that
begins the numbered chapter sequence (e.g. "Chapter 1", "Chapter I", "Capítulo 1"). Any
headings before that (like "Preface", "Introduction", "To the Reader", "Prólogo", etc.)
are prefatory material. If every heading is a numbered chapter, `chStart` is 1.

Confirm the `chStart` value with the user, then run:

```
fl chapterize <raw.adoc> <dest> <chStart>
```

Where `dest` is the relative path to the edition directory (e.g.
`en/george-fox/journal/updated`).

After chapterizing:

1. Delete the generated `rename.sh` file from the edition directory.
2. Move `raw.adoc` to `/tmp/` (preserving the filename, e.g. `/tmp/raw.adoc`) so it can be
   restored if needed.

Tell the user: "If the chapterization looks wrong, I can restore the raw.adoc file and we
can redo it."

## Step 11: Rename chapter files

`fl chapterize` generates default filenames: it names the first sections `preface`,
`forward`, `introduction`, then uses `chapter-N` for the rest. These usually need renaming
to match our conventions.

Read the heading (`== ` line) from each generated file and propose renames based on these
conventions:

**Prefatory material (English):** `preface`, `forward`, `introduction`, `to-the-reader`,
`epistle-preface`, `advertisement`, `preliminary-observations`

**Prefatory material (Spanish):** `prefacio`, `prologo`, `introduccion`, `al-lector`,
`aviso`

**Chapters:** English uses `chapter-N`, Spanish uses `capitulo-N` (no accent).

**Sections (when not numbered chapters):** English `section-N`, Spanish `seccion-N`.

**End matter (English):** `testimony`, `testimonies`, `appendix`, `conclusion`, `letters`,
`epistles`

**End matter (Spanish):** `apendice`, `cartas`, `testimonio`, `conclusion`

**Rules:**

- Always zero-padded 2-digit prefix: `01-`, `02-`, etc.
- Never use accented characters in filenames.
- Slugify: lowercase, hyphens, no special characters.
- Keep the sequential numbering from chapterize; only change the slug portion.

Present the proposed renames as a list (e.g. `03-chapter-1.adoc` → `03-capitulo-1.adoc`)
and wait for the user to confirm or adjust before executing.

**Checkpoint:** Pause and let the user know the renames are done. List the final filenames
and ask if they want to review or commit before proceeding.

## Step 12: Lint and fix

Run `fl lint <path> --fix` on the edition directory twice in a row — some fixes only
become possible after other fixes have been applied.

After both passes, run `fl lint <path>` once more without `--fix`. If there are remaining
lint failures, present them to the user one by one and ask how they want to fix each one.
Every lint error must be resolved — either fixed or explicitly disabled with a lint ignore
comment. Books cannot be published with any lint errors.

To disable a lint rule, add a comment on the line immediately before the offending line:

```
// lint-disable <rule-name> "optional explanation"
```

Common rules that legitimately need disabling:

- `invalid-characters` — for Greek text (`κλήρυς`), Latin ligatures (`æ`, `œ`), fractions
  (`½`, `¾`), section signs (`§`), or other non-ASCII characters that are intentional
- `person-mismatch` — archaic subject-verb agreement in historical quotes (e.g. "you
  seems", "you keeps")
- `scan-errors` — words like "ray" in poetry flagged as OCR errors
- `modernize-words` — intentional archaic language or proper names that match flagged
  patterns

**Never add a lint-disable comment without explicit user approval.** Propose each disable
to the user with the rule name, the offending text, and surrounding context. Only add it
after the user confirms (e.g. `// lint-disable invalid-characters "κλήρυς"`).

**Checkpoint:** Pause and let the user know linting is done. Ask if they want to review or
commit before proceeding.

## Step 13: Restore italics

The italics step is the most complicated step. When you have completed all of the prior
steps, then read into context the `./italics-step.md` document. If the book being
processed is large, consider spawning an sub-agent to handle just this step so it can hold
the minimal context and focus on the task.

**Checkpoint:** Pause and let the user know italics restoration is done. Ask if they want
to review or commit before proceeding.

## Step 14: Re-run lint

Adding italics sometimes introduces lint errors, particularly line-length errors. Re-run
the lint command, and summarize for the user which errors were introduced. Offer to fix
them - if they are line length errors and the user instructs you to fix them, resolve them
by breaking the line at a logical point, ideally at punctation, and when possible (but not
always) keeping italics and small quotes together. This sometimes means re-arranging a
line before or after as well, to avoid very small lines.

**Checkpoint:** Pause and let the user know the re-linting is done. Ask if they want to
review or commit before proceeding.

## Step 15: Generate PDF

Run `fl make <pattern>` where pattern matches the edition directory (e.g.
`george-fox/journal`). This produces a PDF and validates that the AsciiDoc parses
correctly.

If the command errors, present the errors to the user with context and explanation, but do
not attempt fixes without the user's input. Work together to resolve them, then re-run.

If it succeeds, let the user know the doc prep is complete. Suggest they eyeball the
generated PDF if they want to, but otherwise the document is ready for publishing.
