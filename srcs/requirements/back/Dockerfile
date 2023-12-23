FROM node:lts-alpine AS builder

RUN mkdir app
WORKDIR /app

COPY package*.json ./

COPY prisma/schema.prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:lts-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]