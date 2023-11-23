FROM node:18-alpine
RUN mkdir -p /home/node_modules && chown -R node:node /home
WORKDIR /home
COPY package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000