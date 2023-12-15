FROM node:lts-alpine AS builder

RUN mkdir test
WORKDIR /test

COPY package*.json ./

COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

FROM node:lts-alpine

COPY --from=builder /test/node_modules ./node_modules
COPY --from=builder /test/package*.json ./
COPY --from=builder /test/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]