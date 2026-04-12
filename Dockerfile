# syntax=docker/dockerfile:1

# ---- deps + build (Vite) ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ---- static serve ----
# NGINX_CONF: docker-compose(같은 네트워크) = default.conf, Cloud Run 단독 = cloudrun.conf
FROM nginx:1.27-alpine AS runner

ARG NGINX_CONF=default.conf
COPY docker/nginx/${NGINX_CONF} /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]