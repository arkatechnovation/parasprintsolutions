FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --omit=dev --workspace=backend --include-workspace-root
COPY backend/src backend/src
COPY backend/data backend/data
ENV NODE_ENV=production
USER node
EXPOSE 4000
CMD ["npm","start","-w","backend"]
