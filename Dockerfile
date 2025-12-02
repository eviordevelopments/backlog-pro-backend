# Dockerfile para Desarrollo con docker compose watch
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de compilación para bcrypt
RUN apk add --no-cache curl

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto (usa variable de entorno del .env.local, default 3001)
EXPOSE ${PORT:-3001}

# Iniciar en modo desarrollo con hot reload
# NestJS detectará cambios automáticamente con docker compose watch
CMD ["npm", "run", "start:dev"]
