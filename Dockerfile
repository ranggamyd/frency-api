# Gunakan node image sebagai base image
FROM node:14

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json jika ada, kemudian install dependencies
COPY package*.json ./
RUN npm install

# Copy seluruh kode aplikasi ke dalam container
COPY . .

# Port yang digunakan oleh aplikasi
EXPOSE 8080

# Command untuk menjalankan aplikasi saat container dijalankan
CMD ["node", "src/main.js"]
