FROM node:lts-alpine AS builder

RUN mkdir app
WORKDIR /app

COPY package*.json ./

COPY prisma/schema.prisma ./prisma/

RUN npm i

COPY . .

RUN npm run build

FROM node:lts-alpine

EXPOSE 3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./ 
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["npm", "run", "prod"]