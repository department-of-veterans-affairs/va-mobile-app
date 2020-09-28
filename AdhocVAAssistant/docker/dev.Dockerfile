FROM node:12-alpine

WORKDIR /app

COPY package* ./
COPY *.js* ./
COPY *config ./
COPY __tests__ ./
COPY src ./src
CMD npm install && npm run start