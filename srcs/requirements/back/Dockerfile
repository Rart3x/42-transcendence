FROM node:lts-alpine

RUN mkdir src
WORKDIR /src

COPY package*.json ./

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 8080

CMD ["wait-for-postgres.sh", "postgres", "&&", "npm", "run", "build"]