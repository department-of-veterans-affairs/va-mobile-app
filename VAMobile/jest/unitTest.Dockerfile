FROM node:14 as build
WORKDIR /app
COPY package* ./
COPY *.lock ./
RUN yarn install --frozen-lockfile

COPY *.ts ./
COPY *.json ./
COPY *.js ./
COPY jest ./jest
COPY env ./env
COPY src ./src

RUN yarn test
