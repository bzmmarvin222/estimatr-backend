FROM node:dubnium-alpine

WORKDIR /usr/src/app
COPY dist/ /usr/src/app/dist
COPY ./package.json ./package-lock.json /usr/src/app/

RUN npm install --only=production

USER node

EXPOSE 3000

CMD ["node", "./dist/main.js"]