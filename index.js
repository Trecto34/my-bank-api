import express from "express";
import accountsRouter from "./routes/accounts.js";
import { promises as fs } from "fs";
import winston from "winston";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./doc.js";

const app = express();
const port = 3000;

//This open the API, so another server can use it
app.use(cors());

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static("public"));
const { readFile, writeFile } = fs;

global.fileName = "accounts.json";

//This is the configuration to write the errors in the my-bank-api.log
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

app.use(express.json());
app.use("/account", accountsRouter);

//Open the server
app.listen(port, async () => {
  try {
    await readFile(global.fileName);
    global.logger.info("Api started");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile("accounts.json", JSON.stringify(initialJson))
      .then(() => {
        global.logger.info("Api started, and file created");
      })
      .catch((err) => {
        global.logger.error(err);
      });
  }
});
