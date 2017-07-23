.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	@yarn
	@./node_modules/.bin/lerna bootstrap

test: ## Launch unit tests
	./node_modules/.bin/jest --projects packages/aor-graphql-client packages/aor-graphql-client-graphcool
	./node_modules/.bin/lerna run build

watch-test: ## Launch unit tests
	./node_modules/.bin/jest --watch --projects packages/aor-graphql-client packages/aor-graphql-client-graphcool

run: ## Start the demo app
	@cd ./packages/admin-on-rest-graphql-demo && yarn start

deploy: ## Deply the demo app
	@cd ./packages/admin-on-rest-graphql-demo && yarn deploy

build: ## build the packages
	@cd ./packages/aor-graphql-client-graphcool && ${MAKE} build
	@cd ./packages/aor-graphql-client && ${MAKE} build

watch: ## build the packages
	@cd ./packages/aor-graphql-client && ${MAKE} watch > /tmp/log &
	p1=$!
	@cd ./packages/aor-graphql-client-graphcool && ${MAKE} watch > /tmp/log &
	p2=$!
	tail -f /tmp/log
	trap 'kill "$p1"; kill "$p2"' SIGINT
	while kill -s 0 "$p1" || kill -s 0 "$p2"; do
	wait "$p1"; wait "$p2"
	done &>/dev/null

deploy-demo:
	@cd ./packages/admin-on-rest-graphql-demo && yarn deploy

publish:
	@./node_modules/.bin/lerna publish
