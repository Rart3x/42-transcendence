NAME = transcendence

all: build
	@printf "Launch configuration ${NAME}...\n"
	@docker-compose -f ./srcs/docker-compose.yml up -d || docker compose -f ./srcs/docker-compose.yml up -d

build:
	@mkdir -p ${HOME}/data/postgres_data
	@mkdir -p ${HOME}/data/pgadmin_data
	@printf "Building configuration ${NAME}...\n"
	@docker-compose -f ./srcs/docker-compose.yml build || docker compose -f ./srcs/docker-compose.yml build

down:
	@printf "Stopping configuration ${NAME}...\n"
	@docker-compose -f ./srcs/docker-compose.yml down || docker compose -f ./srcs/docker-compose.yml down

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

.PHONY	: all build down re clean fclean