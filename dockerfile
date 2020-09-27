FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN rm -rf test-functional

RUN npx tsc --outDir ./build

RUN npx prisma generate

CMD ["node", "./build/cmd/patreon-statistics.js"]
