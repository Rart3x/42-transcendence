FROM node:lts AS builder

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm i

COPY . .

RUN npm run build

FROM node:lts

COPY --from=builder /app/.env ./.env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
