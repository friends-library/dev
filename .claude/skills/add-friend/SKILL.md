---
name: add-friend
description:
  Add a new Friend (author) by creating GitHub repo(s) and preparing production SQL
---

## Overview

This skill walks through adding a new Friend (author) to the Friends Library system. It
involves creating GitHub repository metadata, verifying conventions against the local
PostgreSQL database, and preparing SQL for the user to run against production.

## Step 1: Gather Information

Prompt the user for the following details:

- **Name** (e.g. "George Fox")
- **Slug** (e.g. "george-fox")
- **Gender** (male or female)
- **Born** year (integer, e.g. 1624)
- **Died** year (integer or null if still living)
- **Language(s)** — English (`en`), Spanish (`es`), or both
- **Out of band** — explicitly ask the user whether this friend is considered "out of
  band" (true/false). Do not assume a default; always ask.

## Step 2: Create GitHub Repository

Create a public GitHub repo in the appropriate organization(s):

- English: `friends-library/{slug}`
- Spanish: `biblioteca-de-los-amigos/{slug}`

If the friend is being added in both languages, create both repos.

Use this description format:

```
{emoji} {Full Name} ({born}-{died}) source documents
```

- Use 👴 for male, 👵 for female
- Use exactly one space after the emoji
- Use plain hyphen with no spaces between dates: `(1624-1691)`
- If still living, leave death empty: `(1975-)`
- If only death year known, use: `(d. 1713)`
- Keep the rest of the description exactly `source documents`

Example:

```
gh repo create friends-library/george-fox --public --description "👴 George Fox (1624-1691) source documents"
```

## Step 3: Verify locally, then prepare production SQL

Use the local PostgreSQL database only as a reference source to verify the current schema
and existing data conventions. Do not insert anything into the local database as part of
this skill.

Connect to the local PostgreSQL database:

```
psql -U jared -d flp_dev
```

**IMPORTANT:** Before composing SQL, always verify the current schema of the `friends`
table:

```sql
\d friends
```

The schema may have changed since this skill was written. Check for any new columns,
constraints, or changed defaults and adjust the SQL accordingly.

Also inspect existing rows as needed to verify conventions such as slug shape, nullable
fields, language handling, and whether related rows should usually be created in both `en`
and `es`.

Then prepare raw SQL for the user to run against the production database themselves. Do
not execute the SQL. Present it plainly for copy/paste.

Here is an example insert as a starting point:

```sql
INSERT INTO friends (id, lang, name, slug, gender, description, born, died, published, created_at, updated_at, out_of_band)
VALUES
  (gen_random_uuid(), 'en', 'George Fox', 'george-fox', 'male', '', 1624, 1691, NULL, NOW(), NOW(), false);
```

Key notes:

- `id` should be generated with `gen_random_uuid()`
- `description` can be empty string initially
- `died` is `NULL` if the person is still living
- `published` is typically `NULL` for new friends unless the user specifies otherwise
- `created_at` and `updated_at` should both be `NOW()`
- If adding both languages, prepare two rows (one `en`, one `es`)
- The final deliverable is the raw SQL text, not a database write performed by the agent

Show the user the final SQL and make it clear that it is intended for manual execution
against production.
