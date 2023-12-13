FROM node:latest as build-stage
# définit le dossier 'app' comme dossier de travail
WORKDIR /app
# copie 'package.json' et 'package-lock.json' (si disponible)
COPY package*.json ./
# installe les dépendances du projet
RUN yarn install
# copie les fichiers et dossiers du projet dans le dossier de travail (par exemple : le dossier 'app')
COPY . .
# construit l'app pour la production en la minifiant
RUN yarn build

FROM nginx:latest as production-stage
#copie les fichiers compiles du build stage dans le container
COPY --from=build-stage  /app/dist /usr/share/nginx/html
#copie le fichier de configuration nginx depuis le host dans le container
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
#export le port 80
EXPOSE 80
#demarre le serveur nginx
CMD ["nginx", "-g", "daemon off;"]
