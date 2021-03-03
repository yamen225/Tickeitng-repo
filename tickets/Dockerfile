FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn install --only-prod
COPY ./ ./

CMD ["npm", "start"]