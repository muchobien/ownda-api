FROM node:16-alpine as builder

ENV NODE_ENV build
USER node
WORKDIR /home/node

COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile

COPY --chown=node:node . .
COPY --from=stedolan/jq  /usr/local/bin/jq /usr/local/bin/jq
RUN yarn build \
    && yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')

FROM node:16-alpine
ENV NODE_ENV production
USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/main.js"]
