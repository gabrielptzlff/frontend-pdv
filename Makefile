build:
	sudo docker compose build --no-cache
start:
	sudo docker compose up --build -d
down:
	sudo docker compose down