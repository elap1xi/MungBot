FROM node:23.4

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    ffmpeg \
    && npm install --production \
    && apt-get purge -y gcc g++ make \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["node", "index.mjs"]
