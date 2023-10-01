NAME = transcendence

all: build
	@printf "Launch configuration ${NAME}...\n"
	@docker-compose -f ./srcs/docker-compose.yml up -d || docker compose -f ./srcs/docker-compose.yml up -d

build:
	@printf "Building configuration ${NAME}...\n"
	@docker-compose -f ./srcs/docker-compose.yml build || docker compose -f ./srcs/docker-compose.yml build

prisma:
	@npm install -g prisma
	@cd ./srcs/requirements/back/prismaORM && \
	if [ ! -d "prisma" ]; then \
		prisma init; \
	fi \

	# Générez les modèles Prisma automatiquement
	@prisma db pull --schema srcs/requirements/back/prismaORM/prisma/schema.prisma
	# Générez Prisma Client
	@cd ./srcs/requirements/back/prismaORM && \
	prisma generate

back:
	@printf "Running Nest in $(NAME) on localhost:3000...\n"
	@cd ./srcs/requirements/back/nest/db && npm start

front:
	@printf "Running Vue in ${NAME}...\n"
	@cd ./srcs/requirements/front && (npm install 18 || true) && npm run dev &
	@sleep 5
	@google-chrome "http://localhost:5173/" || firefox "http://localhost:5173/" || true

down:
	@printf "Stopping configuration ${NAME}...\n"
	@docker-compose -f ./srcs/docker-compose.yml down -v || docker compose -f ./srcs/docker-compose.yml down -v

re: down
	@printf "Rebuild configuration ${NAME}...\n"
	@docker-compose -f ./srcs/docker-compose.yml up -d --build || docker compose -f ./srcs/docker-compose.yml up -d --build

clean: down
	@printf "Cleaning configuration ${NAME}...\n"
	@docker system prune -a

fclean:
	@printf "Total clean of all configurations docker\n"
	@if [ $$(docker ps -q | wc -l) -gt 0 ]; then \
	    docker stop $$(docker ps -qa); \
	fi
	@docker system prune --all --force --volumes
	@docker network prune --force
	@docker volume prune --force

.PHONY	: all build down re clean fclean vue