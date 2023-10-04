FROM node:16-slim AS prisma-client
WORKDIR /usr/src/app
COPY package.json package.json
COPY prisma prisma
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm
RUN pnpm
RUN pnpm prisma:generate

FROM node:16-slim AS dependencies

WORKDIR /app
COPY package.json ./
RUN npm install -g pnpm
RUN pnpm install

FROM node:16-slim AS build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm
RUN npx prisma generate
RUN pnpm run build

FROM node:16-slim AS deploy

WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["pnpm", "run", "start"]