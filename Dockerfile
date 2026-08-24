# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
RUN corepack enable && corepack prepare pnpm@11.22.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG SITE_URL=https://scan.netcha.se
ENV SITE_URL=$SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:22-bookworm-slim AS playwright-runtime
WORKDIR /playwright
RUN printf '%s\n' '{"private":true,"dependencies":{"playwright":"1.62.1"}}' > package.json && \
    npm install --ignore-scripts --omit=dev

FROM mcr.microsoft.com/playwright:v1.62.1-noble AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV SITE_URL=https://scan.netcha.se
ENV NEXT_PUBLIC_SITE_URL=https://scan.netcha.se

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=playwright-runtime /playwright/node_modules/playwright ./node_modules/playwright
COPY --from=playwright-runtime /playwright/node_modules/playwright-core ./node_modules/playwright-core

RUN chown -R pwuser:pwuser /app
USER pwuser

EXPOSE 3000
CMD ["node", "server.js"]
