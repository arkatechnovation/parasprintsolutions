FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm ci
COPY frontend frontend
COPY scripts/start-web.mjs scripts/wait-for-api.mjs scripts/load-env.mjs scripts/
ARG API_INTERNAL_URL=http://backend:4000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_GA_ID=
ENV API_INTERNAL_URL=$API_INTERNAL_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
RUN npm run build -w frontend
RUN npm prune --omit=dev
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json package.json
COPY --from=build /app/scripts scripts
COPY --from=build --chown=node:node /app/frontend frontend
USER node
EXPOSE 3000
CMD ["npm","start","-w","frontend"]
