import express from "express";
import { promises as fs } from "fs";
const { readFile, writeFile } = fs;
const router = express.Router();


//POST method to add new accounts
router.post("/", async (req, res, next) => {
  try {
    let account = req.body;

    if (!account.name || !account.balance == null) {
      throw new Error("Name and Balance missing");
    }

    const data = JSON.parse(await readFile(global.fileName));

    account = {
      id: data.nextId++,
      name: account.name,
      balance: account.balance,
    };
    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);

    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

//GET method to request all the accounts
router.get("/", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;
    res.send(data);

    logger.info("GET /account");
  } catch (err) {
    next(err);
  }
});

//GET method to request 1 account by ID
router.get("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    res.send(account);

    logger.info("GET /account/id:");
  } catch (err) {
    next(err);
  }
});

//DELETE method to delete an account by the ID
router.delete("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.end();
    logger.info(`DELETE /account/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

//PUT method to add a new account
router.put("/", async (req, res, next) => {
  try {
    const account = req.body;

    if (!account.id || !account.name || account.balance == null) {
      throw new Error("Id, Name and Balance missing");
    }

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((a) => a.id === account.id);

    if (index == -1) {
      throw new Error("Register not found");
    }

    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);
    logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

//Treatment of errors
router.use((err, req, res, next) => {
  global.logger.error(`${req.method} ${req.baseUrl} ${err.message}`);
  next(err);
});

//Exporte to use in another script
export default router;
