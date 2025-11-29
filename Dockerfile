# Dockerfile para Desarrollo con docker compose watch
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de compilación para bcrypt
RUN apk add --no-cache python3 make g++

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Iniciar en modo desarrollo con hot reload
# NestJS detectará cambios automáticamente con docker compose watch
CMD ["npm", "run", "start:dev"]
