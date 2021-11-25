FROM node:16

# Create app directory
WORKDIR /home/github/spk-indexer-node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --legacy-peer-deps
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .


RUN npx ts-node ./scripts/setup.ts

CMD [ "npm", "run", "dev" ]
