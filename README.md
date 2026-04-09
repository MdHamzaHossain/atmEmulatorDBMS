# ATM Emulator
A full stack app emulating a barebones site with a database. 

## How To Install
- Clone the repository
- `npm install` 
- Create `db/atm.db`
- Run `node .`

## Tech
- `ExpressJS` backend server
- `Sqlite3` local file Database
- Raw HTML-CSS-JS barebone server
## Demo


https://github.com/user-attachments/assets/f51f2528-daea-4551-93de-46ff32969395


## Folder Structure
```
db/                   # Holds the local database file
│   └── atm.db
│
node_modules/         # Dependencies installed via npm
│
public/               # Frontend pages and assets
│   ├── balance.html
│   ├── create.html
│   ├── deposit.html
│   ├── history.html
│   ├── index.html
│   ├── loan.html
│   ├── script.js
│   ├── style.css
│   ├── transfer.html
│   ├── withdraw.html
│   │
│   ├── assets/       # Static assets (media files)
│   │   └── demo/
│   │       ├── AtmDemo1.mp4
│   │       └── ATMDemo2.gif
│   │
│   └── js/           # Submission scripts for corresponding pages
│       ├── balance.js
│       ├── create.js
│       ├── deposit.js
│       ├── history.js
│       ├── index.js
│       ├── loan.js
│       ├── transfer.js
│       └── withdraw.js
│
queries/              # SQL queries for each action
│   ├── auth_account.sql
│   ├── bank_budget.sql
│   ├── check_balance.sql
│   ├── check_balance_auth.sql
│   ├── create_account.sql
│   ├── deduct_bank.sql
│   ├── deposit.sql
│   ├── ensure_bank.sql
│   ├── get_history.sql
│   ├── loan.sql
│   ├── log_deposit.sql
│   ├── log_loan.sql
│   ├── log_withdraw.sql
│   ├── reset_tables.sql
│   ├── transfer.sql
│   └── withdraw.sql
│
schema/               # Table creation SQL queries
    ├── create_accounts_table.sql
    ├── create_bank_table.sql
    └── create_transactions_table.sql
```
### Workflow overview
```
HTML Page -> Submit button -> JS Script -> Request to API -> SQL Query
```

