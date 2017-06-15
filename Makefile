.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
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
