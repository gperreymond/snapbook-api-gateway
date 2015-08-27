.PHONY: build run

.SUFFIXES:

OPEN = $(shell which xdg-open || which open)
PORT ?= 8080

install:
	npm install

build:
	docker build --rm -t snapbook/api-gateway .

build-release:
	docker run --rm -v $(shell pwd):/src centurylink/golang-builder
	shasum snapbook-api-gateway > snapbook-api-gateway-checksum.txt

test:

run:
	-docker stop snapbook/api-gateway
	-docker rm snapbook/api-gateway
	docker run -d -p $(PORT):8080 -v /var/run/docker.sock:/docker.sock --name snapbook-api-gateway snapbook-api-gateway -e /docker.sock 

open:
	$(OPEN) localhost:$(PORT)