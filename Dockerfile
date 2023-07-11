FROM node:20-alpine3.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

ENV NODE_ENV=production

ENV CONFLY_TOKEN=token

COPY . .

CMD ["npm", "run", "start"]