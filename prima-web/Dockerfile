FROM node:22-alpine AS base
WORKDIR /repo
COPY prima-web/package*.json ./prima-web/
RUN cd prima-web && npm ci
COPY prima-web/ ./prima-web/
RUN cd prima-web && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=base /repo/prima-web/.next/standalone ./
COPY --from=base /repo/prima-web/.next/static ./.next/static
COPY --from=base /repo/prima-web/public ./public
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production
CMD ["node", "server.js"]
