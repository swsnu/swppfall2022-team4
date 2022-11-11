# frontend/Dockerfile
FROM node:16.18.1

RUN mkdir -p /app/frontend
WORKDIR /app/frontend

COPY package.json /app/frontend/package.json
RUN npm install

COPY . .

ENTRYPOINT [ "npm", "start" ]
EXPOSE 3000