FROM node:latest as build-stage
# creer le dossier app si il n'existe pas
RUN mkdir app
# donne les droits
RUN chmod -R 777 /app/
# définit le dossier 'app' comme dossier de travail
WORKDIR /app
# copie 'package.json' et 'package-lock.json' (si disponible)
COPY ./front/package*.json ./
# installe les dépendances du projet
RUN npm install
# copie les fichiers et dossiers du projet dans le dossier de travail (par exemple : le dossier 'app')
COPY . .
# change de dossier
WORKDIR front
# construit l'app pour la production en la minifiant
CMD ["npm", "run", "dev"]
