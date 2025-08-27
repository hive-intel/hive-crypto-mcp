# Use Node.js 20 LTS as base image
FROM node:22-alpine AS base

WORKDIR /app

# Copy everything first (so src, tsconfig, tsup.config.ts etc are present)
COPY . .

# Install dependencies
RUN npm install

# Build
RUN npm run build

EXPOSE 8080

CMD ["node", "build/server.js"]
