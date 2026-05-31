FROM node:22-alpine

WORKDIR /app

RUN npm install -g hive-intelligence@1.1.4

COPY glama-stdio-wrapper.mjs /app/glama-stdio-wrapper.mjs

ENV NODE_ENV=production

USER node

CMD ["node", "/app/glama-stdio-wrapper.mjs"]
