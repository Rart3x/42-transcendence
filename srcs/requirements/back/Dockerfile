FROM node:lts-alpine AS builder

RUN mkdir app
WORKDIR /app

COPY package*.json ./

COPY prisma/schema.prisma ./prisma/

RUN npm i

COPY . .

RUN apk add openssl
RUN mkdir -p ./src/secret 
RUN openssl req -x509 -newkey rsa:4096 -keyout ./src/secret/key.pem -out ./src/secret/cert.pem -sha256 -days 365 -nodes -subj "/C=FR/ST=Angouleme/"

RUN npm run build

FROM node:lts-alpine

EXPOSE 3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./ 
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/src/secret ./secret

RUN chmod 777 ./secret

CMD ["npm", "run", "prod"]