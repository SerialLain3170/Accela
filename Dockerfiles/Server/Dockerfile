FROM node:15-alpine

RUN mkdir {templates,static}

COPY index.ts .
COPY package.json .
COPY tsconfig.json .
COPY artists.txt .
COPY templates/ templates/
COPY static/ static/

RUN yarn install

EXPOSE $PORT

CMD ["npx", "ts-node", "index.ts"]
