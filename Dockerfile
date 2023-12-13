FROM cypress/included:12.17.1
WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "run", "cypress:run"]
