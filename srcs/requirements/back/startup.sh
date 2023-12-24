#!/bin/sh
npx prisma migrate dev && npx prisma studio&

npm run start:prod