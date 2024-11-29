FROM cypress/included:cypress-13.8.1-node-20.12.2-chrome-124.0.6367.60-1-ff-125.0.2-edge-124.0.2478.51-1

WORKDIR app

ENV POSTGRES_HOST=127.0.0.1
ENV DATA_SERVICE_URL='http://127.0.0.1:3000/api'

ARG BASE_URL

COPY .yarn ./.yarn
COPY apps/calculator ./apps/calculator
COPY apps/calculator-e2e ./apps/calculator-e2e
COPY apps/icalc-cli ./apps/icalc-cli
COPY /libs ./libs
COPY .yarnrc.yml ./.yarnrc.yml
COPY nx.json ./nx.json
COPY package.json ./package.json
COPY tsconfig.base.json ./tsconfig.base.json
COPY webpack-options.js ./webpack-options.js

RUN yarn config set -H enableImmutableInstalls false && yarn

ENTRYPOINT ./node_modules/.bin/nx run calculator-e2e:e2e --skipServe=true --baseUrl=$BASE_URL
