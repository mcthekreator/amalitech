FROM node:20-slim

WORKDIR app

ENV DATA_SERVICE_URL='http://127.0.0.1:3000/api'

COPY .yarn ./.yarn
COPY apps/calculator ./apps/calculator
COPY /libs ./libs
COPY .yarnrc.yml ./.yarnrc.yml
COPY nx.json ./nx.json
COPY package.json ./package.json
COPY tsconfig.base.json ./tsconfig.base.json
COPY webpack-options.js ./webpack-options.js

RUN yarn

EXPOSE 4200

ENTRYPOINT ./node_modules/.bin/nx run calculator:serve:development

