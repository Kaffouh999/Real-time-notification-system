# Build stage for Angular frontend
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
COPY angular.json tsconfig.* ./
COPY src ./src

RUN npm ci --legacy-peer-deps
RUN npm run build -- --configuration production

# Serve stage using nginx
FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
# Copy a default nginx.conf if needed (optional)
# EXPOSE 80 (nginx exposes 80 by default)
