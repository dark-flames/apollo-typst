.PHONY: fe typst site clean

all: clean fe typst build
dev: clean fe typst serve

fe:
	cd frontend && npm install && npm run build:prod

typst:
	cd typst && ./build.sh

build:
	zola build

serve:
	zola serve

clean:
	rm -rf static/typst
	cd frontend && npm run clean