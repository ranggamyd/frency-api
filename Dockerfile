# Build image
FROM node:16.13-alpine as builder
WORKDIR /app

# Not sure if you will need this
# RUN apk add --update openssl

COPY package*.json ./
RUN npm ci --quiet

COPY ./prisma prisma
COPY ./src src
RUN npm run build

# Production image

FROM node:16.13-alpine
WORKDIR /app
ENV NODE_ENV production

COPY package*.json ./
RUN npm ci --only=production --quiet

COPY --chown=node:node --from=builder /app/prisma /app/prisma
COPY --chown=node:node --from=builder /app/src /app/src

USER node

EXPOSE 8080
CMD ["node", "src/main.js"]