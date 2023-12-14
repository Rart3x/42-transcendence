FROM node:lts-alpine AS builder

RUN apk update && apk add bash postgresql-client

RUN mkdir test
WORKDIR /test

COPY package*.json ./

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 8080

CMD ["bash", "wait-for-postgres.sh", "postgres", "npm", "run", "build"]