FROM node:23.4-bookworm

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN cp certs/cert.pem /usr/local/share/ca-certificates/cert.crt && update-ca-certificates

CMD ["npm", "start"]