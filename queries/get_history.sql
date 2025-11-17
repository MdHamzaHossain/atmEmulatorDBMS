SELECT
    type,
    amount,
    timestamp
FROM
    transactions
WHERE
    account_id = ?
    AND bank_id = ?
    AND (
        type = ?
        OR ? = ''
    )
ORDER BY
    timestamp DESC
LIMIT
    10;