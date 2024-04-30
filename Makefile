dev-up-build:
	docker-compose --profile dev up -d --build
	docker rmi $$(docker images -f "dangling=true" -q)

dev-down:
	docker compose --profile dev down

prod-up-build:
	docker compose --profile prod up -d --build
	docker rmi $$(docker images -f "dangling=true" -q)

prod-down:
	docker compose --profile prod down