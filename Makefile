NAME = transcendence

#-------------------------------------CLASSICS-------------------------------------#
all:
	# ./change_hostname.sh
	@make run

run:
	@printf "Launch configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml up -d

build:
	@printf "Building configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml build

down:
	@printf "Stopping configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml down -v

re: down
	@printf "Rebuild configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml up -d --build

tailwind:
	@cd ./srcs/requirements/front && npx tailwindcss -i ./src/templates/input.css -o ./src/templates/input.css --watch

clean: down
	@printf "Cleaning configuration ${NAME}...\n"
	@docker system prune -a

fclean: down
	# ./reset_hostname.sh
	@printf "Total clean of all configurations docker\n"
	@if [ $$(docker ps -q | wc -l) -gt 0 ]; then \
	    docker stop $$(docker ps -qa); \
	fi
	@docker system prune --all --force --volumes
	@docker network prune --force
	@docker volume prune --force

.PHONY	: all build down re clean fclean vue