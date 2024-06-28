# Dockerfile for Node.js application
FROM node:latest

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración y dependencias
COPY package.json .
COPY package-lock.json .

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que corre tu aplicación Node.js
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
