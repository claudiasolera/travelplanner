.PHONY: install dev build clean

install:
	cd frontend && npm install
	cd backend && npm install

dev:
	docker-compose up -d
	cd backend && npm run dev &
	cd frontend && npm run dev

build:
	cd frontend && npm run build
	cd backend && npm run build

clean:
	docker-compose down -v
	rm -rf frontend/node_modules frontend/.next
	rm -rf backend/node_modules backend/dist
