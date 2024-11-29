FROM node:20-slim as base

WORKDIR /app

RUN apt-get update && apt-get install -y \
        libreoffice-calc \
        xvfb \
        && rm -rf /var/lib/apt/lists/* 

FROM base as runner

WORKDIR /app

ENV SERVICE_RUN_PORT=3000
ENV APP_USER 5440
ENV APP_GROUP 5000

COPY --chown=${APP_USER}:${APP_GROUP} ./dist/apps/data-service .

HEALTHCHECK --interval=15s --timeout=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${SERVICE_RUN_PORT}/api || exit 1

EXPOSE ${SERVICE_RUN_PORT}

USER ${APP_USER}:${APP_GROUP}

CMD ["node", "main.js"]
