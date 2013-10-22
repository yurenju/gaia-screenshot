TESTS?=$(shell find test -name *_test.js)
MOCHA_OPTS=--require test/test_helper.js\
			--reporter spec\
			--timeout 10s\
			--ui tdd

.PHONY: default
default: lint

.PHONY: lint
lint:
	gjslint --recurse . \
			--disable "220,225" \
			--exclude_directories "node_modules"

.PHONY: test-unit
test-unit:
	SYNC=true ./node_modules/.bin/mocha $(MOCHA_OPTS)

.PHONY: run-server
run-server:
	PORT=3000 node index.js
