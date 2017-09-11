SHELL:=/bin/bash
PATHREGEX:=(:|^)\./node_modules/\.bin(:|$$)
ifeq "$(shell [[ $$PATH =~ $(PATHREGEX) ]] && echo 'y' || echo 'n' )" "n"
export PATH:=./node_modules/.bin:$(PATH)
endif

EXT_JS_FILES:=$(wildcard src/js-ext/*.js)
SRC_FILES:=$(EXT_JS_FILES) index.html package.json $(wildcard src src/* src/*/*)
CONFIG_FILES:=$(wildcard config config/*)
TARGET_REFFILE:=dist/index.html

.PHONY: build dev ifrpjs_always mcbkt_client_always lint

all: ifrpjs_always mcbkt_client_always lint build

again: ifrpjs_always mcbkt_client_always clean lint build

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

ifrpjs_always:
	@_scr/update-iframe-phone

mcbkt_client_always:
	@_scr/update-mcbkt-client

node_modules: package.json
	npm install
