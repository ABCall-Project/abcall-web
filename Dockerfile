FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@10.2.4
RUN npm install
RUN npm install -g @angular/cli

ENV PATH="./node_modules/.bin:$PATH"

COPY . .
COPY ./docker/entrypoint.production.sh .
RUN chmod +x ./docker/entrypoint.production.sh
RUN sh ./docker/entrypoint.production.sh

FROM nginx:1.24-alpine
RUN apk --no-cache add curl
RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \
     chmod +x envsubst
COPY ./docker/nginx.conf /etc/nginx/nginx.template
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
COPY --from=builder /app/dist/abcall-web /usr/share/nginx/html
EXPOSE 80
