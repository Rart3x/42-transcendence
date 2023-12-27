FROM node:lts-alpine AS builder

RUN mkdir app
WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build