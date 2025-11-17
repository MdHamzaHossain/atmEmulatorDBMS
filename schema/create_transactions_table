CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    bank_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    -- 'deposit', 'withdraw', 'transfer', 'loan'
    amount INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (bank_id) REFERENCES bank(id)
);