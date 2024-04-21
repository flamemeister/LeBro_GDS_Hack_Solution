FROM node:alpine AS react-app

WORKDIR /app

ADD package.json package-lock.json ./

RUN npm install

ADD . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

