SRC_FILES:=$(wildcard src src/* src/*/*)

.PHONY: dev

build: dist/index.html

dist/index.html: $(SRC_FILES)
	npm run build

dev:
	npm run dev
