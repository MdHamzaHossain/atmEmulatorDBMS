const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();
const db = new sqlite3.Database(path.join(__dirname, "db", "atm.db"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const errors = JSON.parse(
  fs.readFileSync(path.join(__dirname, "errors.json"), "utf8")
);

function loadQuery(file) {
  return fs.readFileSync(path.join(__dirname, "queries", file), "utf8");
}

function sendError(res, code, log) {
  if (log) console.error(log);
  res.status(400).send(errors[code] || errors.GENERIC_ERROR);
}

function authenticate(id, password, callback) {
  const sql = loadQuery("auth_account.sql");
  db.get(sql, [id, password], (err, row) => callback(err || !row ? null : row));
}

function getBalance(id, callback) {
  const sql = loadQuery("check_balance.sql");
  db.get(sql, [id], (err, row) => callback(err || !row ? null : row.balance));
}

function getBankBudget(id, callback) {
  const sql = loadQuery("bank_budget.sql");
  db.get(sql, [id], (err, row) => callback(err || !row ? null : row.budget));
}

function ensureBank() {
  const sql = loadQuery("ensure_bank.sql");
  db.exec(sql, (err) => {
    if (err) console.error("[BANK] Init failed:", err.message);
    else console.log("[BANK] Ready");
  });
}

function initializeSchema() {
  const dir = path.join(__dirname, "schema");
  fs.readdirSync(dir).forEach((file) => {
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    db.exec(sql, (err) => {
      if (err) console.error(`[SCHEMA] ${file}: ${err.message}`);
      else console.log(`[SCHEMA] Loaded ${file}`);
    });
  });
}

ensureBank();
initializeSchema();

app.post("/api/create", (req, res) => {
  const { name, email, address, password, bankId } = req.body;
  const sql = loadQuery("create_account.sql");
  db.run(sql, [name, email, address, password, bankId], function (err) {
    if (err) return sendError(res, "GENERIC_ERROR", `[CREATE] ${err.message}`);
    console.log(`[CREATE] ID=${this.lastID}, BankID=${bankId}`);
    res.send(`Account created with ID ${this.lastID}`);
  });
});

app.post("/api/balance", (req, res) => {
  const { accountId, password } = req.body;
  const sql = loadQuery("check_balance_auth.sql");
  db.get(sql, [accountId, password], (err, row) => {
    if (err) return sendError(res, "GENERIC_ERROR", `[BALANCE] ${err.message}`);
    if (!row) return sendError(res, "INVALID_CREDENTIALS");
    console.log(
      `[BALANCE] ID=${accountId}, BankID=${row.bank_id}, Balance=$${row.balance}`
    );
    res.send(`Your balance is $${row.balance}`);
  });
});

app.post("/api/withdraw", (req, res) => {
  const { accountId, bankId, amount, password } = req.body;
  const sql = loadQuery("withdraw.sql").split(";");
  authenticate(accountId, password, (auth) => {
    if (!auth) return sendError(res, "INVALID_CREDENTIALS");
    db.run(sql[0], [amount, accountId, amount], function (err) {
      if (err || this.changes === 0)
        return sendError(
          res,
          "INSUFFICIENT_FUNDS",
          `[WITHDRAW] ${err?.message}`
        );
      db.run(sql[1], [accountId, bankId, amount], (err) => {
        if (err) console.error(`[TX] ${err.message}`);
      });
      getBalance(accountId, (balance) => {
        if (balance == null) return sendError(res, "BALANCE_FETCH_FAILED");
        res.send(`Withdrew $${amount}. New balance: $${balance}`);
      });
    });
  });
});

app.post("/api/loan", (req, res) => {
  const { accountId, bankId, amount, password } = req.body;
  const sql = loadQuery("loan.sql").split(";");
  authenticate(accountId, password, (auth) => {
    if (!auth) return sendError(res, "INVALID_CREDENTIALS");
    getBankBudget(bankId, (budget) => {
      if (budget == null || budget < amount)
        return sendError(res, "BANK_FUNDS_EXCEEDED");
      db.run(sql[0], [amount, accountId], function (err) {
        if (err)
          return sendError(res, "GENERIC_ERROR", `[LOAN] ${err.message}`);
        db.run(sql[1], [accountId, bankId, amount], (err) => {
          if (err) console.error(`[TX] ${err.message}`);
        });
        db.run(loadQuery("deduct_bank.sql"), [amount, bankId], (err) => {
          if (err) console.error(`[BANK] ${err.message}`);
        });
        getBalance(accountId, (balance) => {
          if (balance == null) return sendError(res, "BALANCE_FETCH_FAILED");
          res.send(`Loan of $${amount} credited. New balance: $${balance}`);
        });
      });
    });
  });
});

app.post("/api/transfer", (req, res) => {
  const { fromId, toId, bankId, amount, password } = req.body;
  const sql = loadQuery("transfer.sql").split(";");
  authenticate(fromId, password, (auth) => {
    if (!auth) return sendError(res, "INVALID_CREDENTIALS");
    db.run(sql[0], [amount, fromId, amount], function (err) {
      if (err || this.changes === 0)
        return sendError(
          res,
          "INSUFFICIENT_FUNDS",
          `[TRANSFER] ${err?.message}`
        );
      db.run(sql[1], [amount, toId], (err) => {
        if (err) console.error(`[TRANSFER] Credit failed: ${err.message}`);
      });
      db.run(sql[2], [fromId, bankId, "transfer", amount]);
      db.run(sql[2], [toId, bankId, "transfer", amount]);
      getBalance(fromId, (balance) => {
        if (balance == null) return sendError(res, "BALANCE_FETCH_FAILED");
        res.send(`Transferred $${amount}. New balance: $${balance}`);
      });
    });
  });
});

app.post("/api/history", (req, res) => {
  const { accountId, bankId, type } = req.body;
  const sql = loadQuery("get_history.sql");
  db.all(sql, [accountId, bankId, type, type], (err, rows) => {
    if (err) return sendError(res, "GENERIC_ERROR", `[HISTORY] ${err.message}`);
    console.log(
      `[HISTORY] Returned ${rows.length
      } entries for ID=${accountId}, BankID=${bankId}, Type=${type || "ALL"}`
    );
    res.json(rows);
  });
});

app.post("/api/reset", (req, res) => {
  const sql = loadQuery("reset_tables.sql");
  db.exec(sql, (err) => {
    if (err) return sendError(res, "GENERIC_ERROR", `[RESET] ${err.message}`);
    console.log("[RESET] Database cleared and bank restored");
    res.send("Database reset complete");
  });
});
app.post("/api/deposit", (req, res) => {
  const { accountId, amount } = req.body;
  console.log("debug", accountId, amount)
  const sql = loadQuery("deposit.sql");
  db.run(sql, [amount, accountId], function (err) {
    if (err || this.changes === 0)
      return sendError(
        res,
        "INVALID CREDENTIALS",
        `[DEPOSIT] ${err}`
      );

    getBalance(accountId, (bl, row) => {
      res.send(`Deposited amount $${amount}. New Balance $${bl}`);
    })
  });

});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
