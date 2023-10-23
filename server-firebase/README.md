# WealthOS Server

# Getting Started

## Running Locally
- Install Node version 18 using `nvm use 18`
- Intall firebase command line tools globally `npm install -g firebase-tools`
- You will also need a Java SDK to run the firebase-tools, so make sure it is installed on your machine
  - Use `brew install java`. 
  - You may need to symlink it, watch for the install commands, after installing with brew it should be:
`sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk`
  - Then verify it works with `java --version` afterwards
- Go into functions directory `cd functions`
- Intall npm modules `npm install`
- Run the firebase emulators `npm run serve`, you will need to authenticate to the firebase console initiallty. Once that is done you can run the `npm run serve` command again to view emulators.
- Firestore, Functions and Auth emulators will be live at `http://localhost:4000/`
- You can make API calls to the endpoint at `http://localhost:5001/wealthos/us-central1/app` 

# Technical Overview (Server)

- The application architecture is written using NodeJS with ExpressJS and Firebase Cloud Firestore as the database provider
- The application uses Firebase Auth for user authentication
- The application runs using serverless architecture with Firebase Cloud Functions
- In order to gather information from a users bank or institution the app uses Plaid's NodeJS solution

## Database Design

Each database follows the model principles.

## User Model

- This is the main user database
- When a user signs up a new record is created
- A users links item holds the institutions a user has linked via plaid
- Holds a snapshot of the users balances and holdings alongside a map of the users accounts
- When a user links an account via plaid, a record is also created or updated in the itemLinks model

## User Accounts

    let Account = {
          name: name,
          balance: balances.current,
          type: type,
          currency: balances.iso_currency_code,
          mask: mask, // Last 4 digits of the users account
          accountId: account_id // Account ID based on Plaid's API
        }

## User Links

    // Holds the Plaid accessToken needed to access the itemId associated with the item
    let link = {
      accessToken: String, /
    	// Returned with a link, used to access information for a certain institution with the itemID
      itemId: String
    }

## ItemLink Model

### Overview

- This model is used primarily for webhooks sent from Plaids API
- When a webhook is sent it includes the following information

    {
        "error": null,
        "item_id": "e3AjQMjPzkHejZjBqajAT6xzKRqdleFLj5XN1",
        "new_transactions": 4,
        "webhook_code": "DEFAULT_UPDATE",
        "webhook_type": "TRANSACTIONS"
    }

- Since it send back the item_id it would be more efficient to search a db that holds the item_id and any user associated with it, then based on the webhook type a action is performed for those users. In this case any user with the item_id would perform a getTransactions api call to updated their transactions.