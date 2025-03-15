include .env

MIGRATION_PATH=database/migration
DB_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_DATABASE}?sslmode=disable

db:
	@docker run --name human-right-edu-db -p 5432:5432 -e POSTGRES_DB=${DB_DATABASE} -e POSTGRES_USER=${DB_USER} -e POSTGRES_PASSWORD=${DB_PASSWORD} -d postgres:17-alpine

migrate/new:
	@migrate create -ext sql -dir "${MIGRATION_PATH}" -seq ${name}

migrate/up:
	@migrate -path "${MIGRATION_PATH}" -database "${DB_URL}" -verbose up

migrate/up1:
	@migrate -path "${MIGRATION_PATH}" -database "${DB_URL}" -verbose up 1

migrate/down:
	@migrate -path "${MIGRATION_PATH}" -database "${DB_URL}" -verbose down

migrate/down1:
	@migrate -path "${MIGRATION_PATH}" -database "${DB_URL}" -verbose down 1

dev:
	@npm run dev

build:
	@npm run build

start:
	@npm start

.PHONY: db migrate/new migrate/up migrate/up1 migrate/down migrate/down1 dev build start