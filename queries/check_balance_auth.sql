SELECT
    balance,
    bank_id
FROM
    accounts
WHERE
    id = ?
    AND password = ?;