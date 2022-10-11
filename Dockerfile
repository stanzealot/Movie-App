FROM node:gallium-alpine

ENV PORT=8500

WORKDIR /app

COPY ["package.json", "./"]

RUN yarn

COPY . .

EXPOSE 8500

CMD ["yarn", "start"]