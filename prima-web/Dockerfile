FROM node:22-alpine AS base
WORKDIR /repo
COPY prima-web/package*.json ./prima-web/
RUN cd prima-web && npm ci
COPY prima-web/ ./prima-web/
RUN cd prima-web && npm run build
RUN cd prima-web && mv .next/standalone . && mv .next/static ./standalone/prima-web/.next/static && mv public ./standalone/prima-web/public

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=base /repo/prima-web/standalone ./
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production
CMD ["node", "server.js"]
