FROM node:20-alpine

COPY ["package.json","/home/node/app/"]

WORKDIR /app

RUN apk update

RUN npm install -g npm@10.2.4

COPY [".","."]

RUN rm -rf node_modules

RUN npm install -g @angular/cli

RUN npm cache clean --force

RUN npm install -g rollup

RUN rm -f node_modules/@angular/compiler-cli/ngcc/ngcc_lock_file

RUN npm install

EXPOSE 8000

CMD ["sh", "./docker/entrypoint.develop.sh"]
