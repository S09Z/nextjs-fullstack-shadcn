FROM node:18-slim as prisma-client
WORKDIR /usr/src/app
COPY package.json package.json
COPY prisma prisma
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile
RUN pnpm prisma generate

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /src
WORKDIR /src

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/yarn.lock ./yarn.lock
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
EXPOSE 8000
CMD [ "pnpm", "start" ]