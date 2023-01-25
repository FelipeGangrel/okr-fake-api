# OKR Fake API

This is a fake API for the OKR project. It is used to test the front-end.

## How to use

0 - You need Docker and Docker Compose installed on your machine.\
1 - Clone the repository\
2 - Create a volume named `mysql`\
3 - Run `docker-compose up -d` on the root folder\
4 - copy the `.env.example` file to `.env`\
5 - Run `npm install`\
6 - Run `node ace migration:run` to run the migrations\
7 - Run `node ace db:seed` to seed the database\
8 - Run `npm run dev` to start the server
9 - Run `docker-compose down` to stop the containers
