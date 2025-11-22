# Etapa 1: Build de la aplicación React con Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servir con Caddy
FROM caddy:2-alpine

# Copiar el Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Copiar los archivos construidos desde la etapa de build
COPY --from=builder /app/dist /srv

# Exponer el puerto (Railway asignará PORT automáticamente)
EXPOSE 3000

# Caddy se ejecutará automáticamente con la imagen base

