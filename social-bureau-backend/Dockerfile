FROM node:18 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn

COPY . .

RUN yarn build

FROM node:18

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/firebase-adminsdk.json ./dist
COPY --from=builder /app/firebase-config.json ./dist
COPY --from=builder /app/.env.example ./.env

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
