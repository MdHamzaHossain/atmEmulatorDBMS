UPDATE
    accounts
SET
    balance = balance + ?
WHERE
    id = ?
    AND password = ?;