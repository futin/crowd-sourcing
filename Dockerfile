FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production
RUN apt-get update
RUN apt-get install -y vim

# Bundle app source
COPY README.md ./
COPY lib ./lib

CMD [ "npm", "run", "start-local" ]
