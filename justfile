_default:
  @just --choose

# app dev

admin:
  @pnpm --filter admin start

jones:
  @pnpm --filter jones start

native:
  @cd apps/native && just

# code quality

check:
  @just nx-run-many lint,format-check,typecheck,test,build,compile

test:
  @just nx-run-many test

compile:
  @just nx-run-many compile

build:
	@just nx-run-many build

typecheck:
	@just nx-run-many typecheck

lint:
	@just nx-run-many lint

lint-fix:
	@just nx-run-many lint:fix

format:
  @just nx-run-many format

format-check:
  @just nx-run-many format:check

nx-reset:
	@pnpm exec nx reset

clean: nx-reset
  @rm -rf apps/admin/node_modules/.vite

prettier:
  @pnpm prettier --write {{invocation_directory()}}

prettier-check:
  @pnpm prettier --check {{invocation_directory()}}

fl *args:
  cd apps/cli && ../../node_modules/.bin/ts-node ./src/app.ts {{args}}

# helpers

[private]
nx-run-many targets:
  @pnpm exec nx run-many --parallel=10 --targets={{targets}}

set positional-arguments
