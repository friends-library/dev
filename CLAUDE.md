# Friends Library Publishing - Monorepo

## Overview

Friends Library is a non-profit organization that digitizes and freely publishes writings
of early members of the Society of Friends (Quakers) from 1650-1890. The project publishes
188+ books in multiple formats (web, PDF, EPUB, MOBI, audiobooks) in both English and
Spanish.

All book content is in Asciidoc, in author-based Git repositories. Books are rendered into
other forms, mostly using HTML/CSS and prince for PDF generation.

**Websites**: friendslibrary.com | bibliotecadelosamigos.org

## Important Notes

When writing code, almost NEVER leave comments, unless something is extremely non-obvious.

When running any `swift test` commands, always prepend `SWIFT_DETERMINISTIC_HASHING=1`

Never make git commits unless I specifically ask you to.

See [docs/dependencies.md](docs/dependencies.md) for dependency update guidelines.

## Monorepo Structure

```
/apps        # 11 applications
/libs-ts     # 19 TypeScript shared libraries
/libs-swift  # 10 Swift shared libraries
```

## Key Applications

### Production Apps

- **evans** - Main Next.js website (friendslibrary.com, bibliotecadelosamigos.org) with
  bilingual support, Algolia search, Stripe payments, audiobook streaming
- **api** - Swift/Vapor GraphQL-like backend (PairQL), PostgreSQL, handles
  orders/downloads/content
- **native** - React Native mobile app (iOS/Android) with offline reading and audio
  playback
- **admin** - React/Vite admin dashboard for content and order management, only used by 2
  people, sort of a GUI for the database/api

### Development Tools

- **cli** - Command-line tool for document processing, PDF/EPUB generation, linting, cloud
  uploads
- **fell** - Git repository management tool for content repos (all our book source repos)
- **jones** - Web-based AsciiDoc editor with live preview
- **cover-web-app** - Book cover design, visualization
- **poster** - YouTube video thumbnail generator (all our audiobooks have YouTube videos)
- **storybook** - Component library documentation
- **styleguide** - Document style guide for asciidoc

## Important Libraries

### TypeScript

- **libs-ts/adoc-lint** - AsciiDoc document linting (100+ custom rules)
- **libs-ts/adoc-utils** - shared AsciiDoc utilities
- **libs-ts/cloud** - custom client for Digital Ocean Spaces (s3-compatible)
- **libs-ts/cover-component** - react component for book covers, used in web and PDF
  generation
- **libs-ts/doc-artifacts** - document file generation (PDF/EPUB/MOBI/EBOOK/etc)
- **libs-ts/doc-css** - shared CSS for document rendering
- **libs-ts/doc-manifests** - data preparation layer, takes a in-memory DocPrecursor and
  produces an in memory FileManifest, ready for filesystem generation
- **libs-ts/dpc-fs** - creates DocPrecursor objects by querying API and local filesystem
- **libs-ts/env** - simple environment variable library
- **libs-ts/parser** - asciidoc parsing to AST
- **libs-ts/evaluator** - asciidoc AST evaluation and transformation into final forms
  (html, speech)
- **libs-ts/friend-repos** - simple utility for fetching data about and cloning all book
  author (friend) content repos
- **libs-ts/hilkiah** - extract bible verse references from text
- **libs-ts/locale** - utilities for working in two languages (English/Spanish)
- **libs-ts/lulu** - client lib for Lulu print-on-demand API, used for ordering paperbacks
- **libs-ts/slack** - client lib for sending slack messages
- **libs-ts/pairql** - typescript clients for PairQL (mostly auto-generated)
- **libs-ts/theme** - shared tailwind config, colors, styling utils
- **libs-ts/types** - monorepo-wide shared TypeScript types

### Swift

- **libs-swift/duet** - Custom ORM/database layer, built on Fluent, for API and postgres
- **libs-swift/pairql** - PairQL (remote RPC-like, graphql like typesafe HTTP
  request/response library) server implementation
- **libs-swift/ts-interop** - TypeScript/Swift codegen for type safety between languages
- **x-stripe** / **x-postmark** / **x-slack** - External service integrations

## Tech Stack

- **Frontend**: React 18, Next.js 14, TailwindCSS 3, React Native 0.72
- **Backend**: Swift 6.2.1, Vapor 4, Duet ORM, PostgreSQL
- **Build**: pnpm 10, Nx 19, esbuild/SWC, Vite 4
- **Testing**: Vitest, Jest, XCTest
- **Quality**: ESLint, Prettier 3.3, SwiftFormat 0.58.5, TypeScript 5.5
- **CI/CD**: GitHub Actions, Docker
- **Docs**: AsciiDoc, Puppeteer (PDF), Prince XML, KindleGen (MOBI)
- **Services**: Algolia, Stripe, Postmark, Lulu (print-on-demand), Digital Ocean Spaces

## Common Commands

```bash
just check   # lint, format, test, build, compile
just test    # Run all tests
just format  # Format all code
just lint    # Lint all code
just build   # Build all apps
```

## Content Pipeline

1. Authors write in **AsciiDoc** format in individual Git repos
2. Content is linted with **100+ custom rules** (`adoc-lint`)
3. Documents are processed through **cli** to generate artifacts
4. **PDF/EPUB/MOBI** formats are created via Puppeteer/Prince/KindleGen
5. **Covers** are auto-generated using React components
6. Artifacts are uploaded to cloud storage and metadata stored in PostgreSQL
7. Content is served via **evans** website and **native** apps

## External Services

- **Algolia** - Search functionality
- **Stripe** - Payment processing
- **Postmark** - Transactional email
- **Slack** - Notifications and logging
- **Lulu** - Print-on-demand paperbacks (at-cost pricing)
- **Digital Ocean Spaces** - Cloud storage for artifacts

## Key Paths

- **API Code**: `/apps/api/Sources/App/`
- **Website**: `/apps/evans/`
- **Mobile**: `/apps/native/`
- **CLI**: `/apps/cli/src/cmd/`
- **Shared Types**: `/libs-ts/types/src/`
