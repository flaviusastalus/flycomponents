.PHONY: up down test bash logs e2e build build-docs

up:
	docker-compose up --build -d dev

down:
	docker-compose down

test:
	docker-compose run --rm dev npm run test

bash:
	docker-compose exec dev bash

logs:
	docker-compose logs -f dev

build:
	docker-compose run --rm dev npm run build

build-docs:
	docker-compose run --rm dev npm run build:docs

default: up
