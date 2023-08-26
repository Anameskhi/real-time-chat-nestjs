FROM node:14 AS api-development

WORKDIR /home/ana/real-time-chat-app/api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000

#production

FROM node:14 AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/ana/real-time-chat-app/api
COPY --from=development /home/ana/real-time-chat-app/api .
EXPOSE 3000

CMD ["node","dist/main"]

