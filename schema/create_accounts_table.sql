CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    address TEXT,
    password TEXT,
    balance INTEGER DEFAULT 100,
    debt INTEGER DEFAULT 0,
    bank_id INTEGER NOT NULL,
    FOREIGN KEY (bank_id) REFERENCES bank(id)
);