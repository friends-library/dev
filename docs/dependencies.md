# Dependency Update Guidelines

## Commit Style

Use the format `scope: update <package> to <version>` for commit messages:

```
monorepo: update typescript to 5.5.2
monorepo: update prettier to 3.3.2
native: upgrade twrnc
storybook: fix next-bg-image stories, update deps
```

For monorepo-wide changes, use `monorepo:` scope. For app-specific updates, use the app
name.

## Version Pinning

**TypeScript packages**: Pin exact versions for core dependencies (no `^` or `~`):

```json
"typescript": "5.5.2",
"prettier": "3.3.2",
"next": "14.1.4",
"react": "18.2.0",
"vitest": "0.28.3"
```

Use caret ranges only for less critical or ecosystem packages that are unlikely to cause
breaking changes.

**Swift packages**: Always use exact version pins:

```swift
.github("vapor/vapor@4.119.1"),
.github("vapor/fluent@4.9.0"),
```

## Atomic Updates

Make small, focused commits updating one dependency (or a related group) at a time:

- Update `typescript` in one commit
- Update `react` + `react-dom` together
- Update `@typescript-eslint/*` packages together
- Update storybook-related packages together

## Monorepo Consistency

Ensure the same version is used across all apps/libs. Check for duplicates with:

```bash
grep -r '"typescript"' apps/*/package.json libs-ts/*/package.json package.json
```

## Process

1. Update version in package.json (or Package.swift)
2. Run `pnpm install` (or `swift package resolve`)
3. Run `just format` to apply any style changes from the update
4. Run `just check` to verify lint/test/build pass
5. Commit only after all checks pass
