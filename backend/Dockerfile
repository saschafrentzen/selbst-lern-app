FROM node:22.14-alpine

DB_USER="postgres"
DB_HOST="localhost"
DB_NAME="to-do-app"
DB_PASSWORD="M.arlon1"
DB_PORT="5432"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3050

CMD ["node", "server.js"]