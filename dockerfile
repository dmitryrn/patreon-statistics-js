FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc --outDir ./build

RUN pwd

CMD ["node", "./build/cmd/patreon-statistics.js"]
