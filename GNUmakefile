SHELL:=/bin/bash
PATHREGEX:=(:|^)\./node_modules/\.bin(:|$$)
ifeq "$(shell [[ $$PATH =~ $(PATHREGEX) ]] && echo 'y' || echo 'n' )" "n"
export PATH:=./node_modules/.bin:$(PATH)
endif

IFRPJS_FILE:=src/js/iframe-phone.js
SRC_FILES:=$(IFRPJS_FILE) index.html package.json $(wildcard src src/* src/*/*)
CONFIG_FILES:=$(wildcard config config/*)
TARGET_REFFILE:=dist/index.html

.PHONY: build dev ifrpjs_always

all: ifrpjs_always build

again: ifrpjs_always clean build

clean:
	rm -rf dist/*

dev: node_modules
	npm run dev

build: $(TARGET_REFFILE)

$(TARGET_REFFILE): $(SRC_FILES) $(CONFIG_FILES) node_modules
	npm run build

ifrpjs_always:
	@_scr/update-iframe-phone

node_modules: package.json
	npm install
