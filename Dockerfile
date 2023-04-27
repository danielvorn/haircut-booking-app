FROM node:16-alpine
WORKDIR /usr/local/apps/myapp/dev

COPY package.json ./
RUN npm install && npm cache clean --force

COPY tsconfig.json ./

COPY .env ./
COPY src ./src

EXPOSE ${PORT}

RUN npm run build
CMD ["npm", "run", "start:watch"]