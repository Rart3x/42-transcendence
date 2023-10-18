NAME = transcendence

#-------------------------------------CLASSICS-------------------------------------#
all: build
	@printf "Launch configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml up -d
	@make prisma
	@make back

build:
	@printf "Building configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml build

down:
	@printf "Stopping configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml down -v

re: down
	@printf "Rebuild configuration ${NAME}...\n"
	@docker compose -f ./srcs/docker-compose.yml up -d --build

#-------------------------------------FRONT/BACK-------------------------------------#
back:
	@printf "Running Nest in $(NAME) on localhost:3000...\n"
	@cd ./srcs/requirements/back/ && npm install && npm start

front:
	@printf "Running Vue in ${NAME}...\n"
	@cd ./srcs/requirements/front && (npm install 18 || true) && npm run dev

#-------------------------------------DB-------------------------------------#
prisma:
	@cd ./srcs/requirements/back/ && \
	npx prisma migrate dev && npx prisma generate

sql:
	@pg_dump -U kramjatt -d "PMU" -f "srcs/requirements/postgreSQL/db.sql"

studio:
	@cd ./srcs/requirements/back/prisma && \
	npx prisma studio

#-------------------------------------CLEANING-------------------------------------#
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