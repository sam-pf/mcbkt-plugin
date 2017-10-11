SHELL:=/bin/bash
PATHREGEX:=(:|^)\./node_modules/\.bin(:|$$)
ifeq "$(shell [[ $$PATH =~ $(PATHREGEX) ]] && echo 'y' || echo 'n' )" "n"
	export PATH:=./node_modules/.bin:$(PATH)
endif

EXT_JS_FILES:=$(wildcard src/js-ext/*.js)
SRC_FILES:=$(EXT_JS_FILES) index.html package.json $(wildcard src src/* src/*/*)
CONFIG_FILES:=$(wildcard config config/*)
TARGET_REFFILE:=dist/stg/index.html
TARGET_REFFILE_PRO:=dist/pro/index.html

.PHONY: build dev pro pub buildpro jsext lint

all: jsext lint build

again: jsext clean lint build

# pro is for real production---must be built manually when time is right.
pro: $(TARGET_REFFILE_PRO)
pub: pro
buildpro: pro
live: dev

clean:
	rm -rf dist/*

dev: node_modules lint
	npm run dev

lint:
	eslint src/js/*.js
	eslint src/*.js

build: $(TARGET_REFFILE)

$(TARGET_REFFILE): $(SRC_FILES) $(CONFIG_FILES) node_modules
	npm run build

$(TARGET_REFFILE_PRO): $(SRC_FILES) $(CONFIG_FILES) node_modules
	npm run buildpro

jsext:
	@[[ -x _scr/update-iframe-phone ]] && _scr/update-iframe-phone || true
	@[[ -x _scr/update-mcbkt-client ]] && _scr/update-mcbkt-client || true
	@[[ -x _scr/update-iframe-logdata-listener ]] && \
		_scr/update-iframe-logdata-listener || true

node_modules: package.json
	npm install
