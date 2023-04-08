_default:
  @just --choose

# app dev

admin:
  @pnpm --filter admin start

jones:
  @pnpm --filter jones start

native:
  @cd apps/native && just

evans:
  @cd apps/evans && just

storybook:
  @pnpm --filter storybook-web start

poster:
  @pnpm --filter poster start

covers:
  @pnpm --filter cover-web-app start

next:
  @cd apps/next-evans && just

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

test-typescript:
  @pnpm exec nx run-many --targets=test --exclude=duet,x-http,x-kit,x-sendgrid,x-slack,x-stripe,api

clean: nx-reset
  @rm -rf apps/admin/node_modules/.vite

prettier:
  @pnpm prettier --write {{invocation_directory()}}

prettier-check:
  @pnpm prettier --check {{invocation_directory()}}

# api

watch-api:
  @just watch-swift apps/api 'just run-api'

run-api: build-api
	@just exec-api serve

run-api-ip: build-api
	@just exec-api serve --hostname 192.168.10.227

build-api:
	@cd apps/api && swift build

migrate-up: build-api
	@just exec-api migrate --yes

migrate-down: build-api
	@just exec-api migrate --revert --yes

test-api:
  @cd apps/api && SWIFT_DETERMINISTIC_HASHING=1 swift test

db-sync:
  @cd apps/api && pnpm ts-node ./sync.ts

# helpers

[private]
nx-run-many targets:
  @pnpm exec nx run-many --parallel=10 --targets={{targets}}

[private]
exec-api cmd *args:
  @cd apps/api && ./.build/debug/Run {{cmd}} {{args}}

[private]
watch-swift dir cmd ignore1="•" ignore2="•" ignore3="•":
  @watchexec --project-origin . --clear --restart --watch {{dir}} --exts swift \
  --ignore '**/.build/*/**' --ignore '{{ignore1}}' --ignore '{{ignore2}}' --ignore '{{ignore3}}' \
  {{cmd}}

swift-watch-build dir:
  @just watch-swift {{dir}} '"cd {{dir}} && swift build"'

swift-watch-test dir isolate="":
  @just watch-swift {{dir}} '"cd {{dir}} && \
  SWIFT_DETERMINISTIC_HASHING=1 swift test \
  {{ if isolate != "" { "--filter " + isolate } else { "" } }} "'

set positional-arguments
