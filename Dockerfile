FROM node:24-alpine

WORKDIR /src

COPY package*.json /

COPY . /src/

RUN npm install

EXPOSE 4000

CMD [ "npm", "start" ]