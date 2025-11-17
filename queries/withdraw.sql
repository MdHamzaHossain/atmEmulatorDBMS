UPDATE
    accounts
SET
    balance = balance - ?
WHERE
    id = ?
    AND balance >= ?;

INSERT INTO
    transactions (account_id, bank_id, type, amount, timestamp)
VALUES
    (?, ?, 'withdraw', ?, CURRENT_TIMESTAMP);