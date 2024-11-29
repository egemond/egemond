FROM node:22 AS base
WORKDIR /app
EXPOSE 3000

COPY . .
RUN npm ci

WORKDIR ./app
RUN npm ci
RUN npm run build

WORKDIR ..

CMD ["node", "./app.js"]
