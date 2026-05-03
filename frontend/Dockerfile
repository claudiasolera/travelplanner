FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build de producción
RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "--port", "4173"]