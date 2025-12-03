FROM node:20.9.0

# RUN apt-get update -y
# RUN apt-get install -y openssl

WORKDIR /app

COPY . .

RUN npm i --registry=https://registry.npmmirror.com;

RUN chmod +x /app/dev.startup.sh

ENTRYPOINT ["sh", "/app/dev.startup.sh"]
