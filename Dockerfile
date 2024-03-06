FROM node:19-alpine
EXPOSE 5173
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app/
CMD ["npm", "run", "dev"]
