# Utiliza una imagen base con Node.js
FROM node:14

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración de npm y el archivo tsconfig.json
COPY package*.json tsconfig.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Compila el código TypeScript a JavaScript
RUN npm run build

# Expone el puerto en el que el proxy escuchará
EXPOSE 8080

# Define el comando por defecto para ejecutar la aplicación
CMD ["node", "dist/proxy.js"]
