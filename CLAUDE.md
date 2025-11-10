# Friends Library Publishing - Monorepo

## Overview

Friends Library is a non-profit organization that digitizes and freely publishes writings
of early members of the Society of Friends (Quakers) from 1650-1890. The project publishes
188+ books in multiple formats (web, PDF, EPUB, MOBI, audiobooks) in both English and
Spanish.

**Websites**: friendslibrary.com | bibliotecadelosamigos.org

## Monorepo Structure

```
/apps             # 11 applications
/libs-ts          # 19 TypeScript shared libraries
/libs-swift       # 10 Swift shared libraries
/audios           # Generated audio files
/artifacts        # Generated PDFs, EPUBs, MOBIs
```

## Key Applications

### Production Apps

- **evans** - Main Next.js website (friendslibrary.com) with bilingual support, Algolia
  search, Stripe payments, audiobook streaming
- **api** - Swift/Vapor GraphQL-like backend (PairQL), PostgreSQL, handles
  orders/downloads/content
- **native** - React Native mobile app (iOS/Android) with offline reading and audio
  playback
- **admin** - React/Vite admin dashboard for content and order management

### Development Tools

- **cli** - Command-line tool for document processing, PDF/EPUB generation, linting, cloud
  uploads
- **fell** - Git repository management tool for content repos
- **jones** - Web-based AsciiDoc editor with live preview
- **cover-web-app** - Book cover design and generation tool
- **poster** - YouTube thumbnail generator
- **storybook** - Component library documentation
- **styleguide** - Document style guide for rendered content

## Important Libraries

### TypeScript

- **pairql** - Custom GraphQL-like API framework
- **adoc-lint** - AsciiDoc linting (100+ custom rules)
- **adoc-utils** / **parser** - AsciiDoc parsing and manipulation
- **doc-artifacts** / **doc-manifests** - Document artifact generation
- **types** / **locale** / **theme** - Shared types, i18n, styling

### Swift

- **duet** - Custom ORM/database layer
- **pairql** - PairQL server implementation
- **ts-interop** - TypeScript/Swift codegen for type safety
- **x-stripe** / **x-postmark** / **x-slack** - External service integrations

## Tech Stack

- **Frontend**: React 18, Next.js 14, TailwindCSS 3, React Native 0.72
- **Backend**: Swift 5.7+, Vapor 4, Fluent ORM, PostgreSQL
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

1. Authors write in **AsciiDoc** format in individual Git repos (`/en/*`, `/es/*`)
2. Content is linted with **100+ custom rules** (`adoc-lint`)
3. Documents are processed through **cli** to generate artifacts
4. **PDF/EPUB/MOBI** formats are created via Puppeteer/Prince/KindleGen
5. **Covers** are auto-generated using React components
6. Artifacts are uploaded to cloud storage and metadata stored in PostgreSQL
7. Content is served via **evans** website and **native** apps

## Document Editions

- **Original**: Unmodified historical text
- **Updated**: Modernized spelling/grammar
- **Modernized**: Contemporary language

## Development Notes

- **Monorepo**: Uses pnpm workspaces + Nx for build orchestration
- **Type Safety**: Strict TypeScript with PairQL + ts-interop codegen for API
- **Bilingual**: Complete English/Spanish support across all apps
- **Testing**: Comprehensive test coverage with Vitest/Jest/XCTest
- **Git**: Content repos are Git submodules with individual CI pipelines

## Code Style

- **Swift**: Do not use `// MARK:` comments or similar section markers in Swift code

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
