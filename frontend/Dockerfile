# frontend/Dockerfile
FROM node:16.18.1 as builder

WORKDIR /app

COPY package.json .
RUN apt-get update && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 
RUN yarn install

COPY . .
RUN mv example.env .env
RUN yarn run build

FROM nginx
EXPOSE 3000 
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html