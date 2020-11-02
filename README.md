Simple API built on Node.js.

How to use: After uploading to a server using Node or Nodemon, you can find the API documentation at "localhost:3000/doc".

Modules used: Express; Winston; Cors; SwaggerUi;

HTTP methods used:

GET: To collect all registered data;

GET/id: To collect only the data of a certain account;

PUT: To edit existing data;

POST: To add new data;

DELETE/id: To delete a certain data, it will be necessary to collect the account identification with GET;

Winston: Used to register the logs that are stored in the "my-bank-api.log" file;

Cors: Used for the API to be used in other sites and projects; SwaggerUI: Used to build the API documentation.

SwaggerUI: Used to build the API documentation:

Notes:

As it is my first time working with the API, it is quite simple and doesn't use a database like MySQL, so the data is stored in the "accounts.json" file;

Both, accounts.json and my-bank-api.log have some data used as placeholder;

There is no predefined security, so anyone with access to this route would be able to access all the data.

