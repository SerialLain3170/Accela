FROM node:15-alpine

COPY index.ts .
COPY package.json .
COPY tsconfig.json .
COPY artists.txt .
RUN mkdir templates
COPY templates/ templates/
RUN mkdir static
COPY static/ static/

RUN yarn install

EXPOSE $PORT

CMD ["npx", "ts-node", "index.ts"]
