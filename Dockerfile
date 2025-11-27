# Dockerfile para Desarrollo con hot reload
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
CMD ["npm", "run", "start:dev"]
