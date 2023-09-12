FROM node:16.13.1-alpine

COPY . .

RUN npm install

ENTRYPOINT [ "node", "./src/server.js" ]

EXPOSE 3000