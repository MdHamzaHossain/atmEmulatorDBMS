UPDATE
    accounts
SET
    balance = balance + ?
WHERE
    id = ?;

INSERT INTO
    transactions (account_id, bank_id, type, amount, timestamp)
VALUES
    (?, ?, 'loan', ?, CURRENT_TIMESTAMP);