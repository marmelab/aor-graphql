.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	@lerna bootstrap

test: ## Launch unit tests
	@lerna run test

run:
	@cd ./packages/admin-on-rest-graphql-demo && yarn start
