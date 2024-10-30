FROM node:20

#Set working directory
WORKDIR /opt/doit

#Copy package.json file
COPY ./package.json /opt/doit/package.json

#Install node packages
RUN npm install
RUN npm install -g nodemon@2.0.20

#Copy all files 
COPY . /opt/doit

#Expose the application port
EXPOSE 4000

#Start the application
CMD ["node", "app.js"]