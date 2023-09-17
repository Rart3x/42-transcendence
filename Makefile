NAME = transcendence

all: build
	@printf "Launch configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml up -d || @docker-compose -f ./srcs/docker-compose.yml up -d

build:
	@mkdir -p ~/data/postregreSQL
	@mkdir -p ~/data/phppgadmin
	@printf "Building configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml build || @docker-compose -f ./srcs/docker-compose.yml build

down:
	@printf "Stopping configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml down

re: down
	@printf "Rebuild configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml up -d --build || @docker-compose -f ./srcs/docker-compose.yml up -d --build

rm_data:
	@rm -rf ~/data/postregreSQL
	@rm -rf ~/data/phppgadmin

clean: down rm_data
	@printf "Cleaning configuration ${NAME}...\n"
	@docker system prune -a

fclean: rm_data
	@printf "Total clean of all configurations docker\n"
	@docker stop $$(docker ps -qa)
	@docker system prune --all --force --volumes
	@docker network prune --force
	@docker volume prune --force

.PHONY	: all build down re clean fclean rm_data
