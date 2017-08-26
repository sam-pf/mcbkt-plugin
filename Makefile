SRC_FILES:=$(wildcard src src/* src/*/*)
CONFIG_FILES:=$(wildcard config config/*)

.PHONY: dev

build: dist/index.html

dist/index.html: $(SRC_FILES) $(CONFIG_FILES)
	npm run build

dev:
	npm run dev
