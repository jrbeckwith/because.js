PATH := node_modules/.bin:$(PATH)
TSC ?= node_modules/.bin/tsc
REMOVE ?= rm --verbose --interactive=never --one-file-system --recursive --force
MKDIR ?= mkdir --verbose
BIN ?= ./node_modules/.bin
SCRIPTS ?= ./scripts
LIB ?= ./lib
DIST ?= ./dist
SOURCE_FILES:=$(shell find src -type f)
TEST_FILES:=$(shell find src -type f)
ES2015_FILES:=$(shell find es2015 -type f)
DOC_THEME_FILES:=$(shell find doc/theme -type f)
# DIST_JS_FILES=$(wildcard dist/*.js)
# DIST_MIN_FILES=$(DIST_JS_FILES:.js=.min.js)

# The first build target is the one run when someone issues just 'make'.
# Conventionally its name is 'all'. It is .PHONY so make will ignore any files
# that happen to be named 'all'.
# Here we run the tests before building other output.
.PHONY: all
all: node_modules test es2015 distfiles doc/build

# node_modules/ holds build dependencies and dependencies to be linked in.
node_modules: package.json
	yarn install --flat
	@touch node_modules

$(TSC): node_modules

.PHONY: distfiles
distfiles: dist dist/because.amd.js dist/because.system.js dist/because.js dist/because.min.js

# dist/ holds bundled output for direct use in browsers supporting ES5.
# I guess this rule just makes the directory because it's always going away
# TODO: ensure all .js have matching min.js in this somehow?
dist: 
	@mkdir -p dist
	@touch dist

dist/because.amd.js: Makefile node_modules config/tsconfig.json $(SOURCE_FILES)
	$(TSC) --project config/tsconfig.json --outFile $@ --module amd --target es5

dist/because.system.js: Makefile node_modules config/tsconfig.json $(SOURCE_FILES)
	$(TSC) --project config/tsconfig.json --outFile $@ --module system --target es5

dist/because.js: Makefile config/webpack.config.js node_modules src $(SOURCE_FILES)
	$(BIN)/webpack --config config/webpack.config.js

# minify anything in dist/
dist/%.min.js: dist/%.js
	$(BIN)/uglifyjs $< --in-source-map $<.map --compress dead_code,unused,properties,join_vars,collapse_vars,warnings --mangle --output $@ --source-map-include-sources --source-map $@.map

# es2015/ holds the library as ES2015 modules containing ES2015 code.
# This could be used directly, bundled for new browsers, or compiled by babel.
es2015: Makefile node_modules config/tsconfig.json config/tsconfig.es2015.json $(SOURCE_FILES)
	$(TSC) --project config/tsconfig.es2015.json
	@touch es2015

# lib/ holds the library as ES5 in CommonJS modules for all versions of Node,
# and via Browserify for direct use in most browsers.
# Files in lib/ are referenced by package.json "main" and "browser".
# "main" references the entry point file used to resolve require("because").
# "browser" references a similar but browser-specific entry point,
# see https://github.com/defunctzombie/package-browser-field-spec
lib: Makefile node_modules config/tsconfig.json config/tsconfig.cjs.json src $(SOURCE_FILES)
	$(TSC) --project config/tsconfig.cjs.json
	@touch lib

lib/test: Makefile node_modules config/tsconfig.json config/tsconfig.test.json $(TEST_FILES)
	$(TSC) --project config/tsconfig.test.json
	@touch lib/test

# doc/build/ holds generated output of doc generators.
# NOTE: typedoc.json has to be in the root or it will barf --help output... :/
doc/build: Makefile config/typedoc.json doc doc/index.md doc/theme $(DOC_THEME_FILES) node_modules
	$(BIN)/typedoc --tsconfig config/typedoc.json --name because.js --readme doc/index.md --theme default --hideGenerator --out doc/build
	@touch doc/build

# coverage/ holds coverage report output.
coverage: lib lib/test
	# node_modules/istanbul/lib/cli.js cover $(BIN)/mocha lib/test/**/*.js && $(BIN)/remap-istanbul -i ./coverage/coverage.json -o ./coverage/html-report -t html
	$(BIN)/nyc $(BIN)/mocha lib/test/**/*.js

# The following build targets are marked .PHONY to tell make not to check the
# existence or timestamp of the file with the name of the build target.
# For example, 'make test' ignores any file named 'test' and just runs the
# rule.

.PHONY: watch
watch:
	webpack --watch --config config/webpack.config.js

.PHONY: compile
compile: es2015 lib

.PHONY: bundle
bundle: distfiles

.PHONY: clean
clean:
	${REMOVE} node_modules es2015 lib dist .nyc_output
	${MKDIR} dist lib es2015

.PHONY: lint
lint: 
	$(BIN)/tslint --project config/tsconfig.cjs.json --config config/tslint.typechecked.json --type-check

.PHONY: test
test: node_modules lib
	$(BIN)/ts-mocha --project config/tsconfig.test.json test/*
