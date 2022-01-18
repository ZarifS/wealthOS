# Wealth-X Server

A new method of tracking personal finance. AI assisted, data driven and a clean beautiful interface. Built using NodeJS, React-Native.

# Technical Overview (Server)

- The application architecture is written using NodeJS with ExpressJS and MongoDB as the database provider
- The application uses bCrypt for encrypting passwords
- The application uses Mongoose to interface with MongoDB models and items
- In order to gather information from a users bank or institution the app uses Plaid's NodeJS solution

## Database Design

Each database follows the mongoose model principles.

## User Model

- This is the main user database
- When a user signs up a new record is created
- A users links item holds the institutions a user has linked via plaid
- Holds a snapshot of the users balances and holdings alongside a map of the users accounts
- When a user links a account via plaid, a record is also created or updated in the itemLinks model

## Schema Design

    // Define User Schema
    const UserSchema = { 
     firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
    		// Hashed in the database before saved using bCrypt
      },
      date: {
        type: Date,
        default: Date.now
    		// Date the user is created
      },
      links: {
        type: Map,
        of: LinksSchema
    		// Refer to User Links
      },
      accounts: {
        type: Map,
        of: Array
    		// Refer to UserAccounts
      },
      balance: {
        type: Number
        // A sum of the users total accounts
      },
      holdings: {
        type: Number
    		// A sum of total investment holdings for a user
      }
    }

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

## Schema Design

    // Each Link is associated with a itemId and a list of Users which have that item linked to them.
    const ItemLinkSchema = {
      itemId: {
        type: String,
        index: true
      },
      users: {
        type: Array,
        default: []
      }
    }

# API Documentation

- The api documentation can be found here: [https://zarifs.github.io/wealthOS/](https://zarifs.github.io/wealthOS/)
- Utilizes Insomnia to test and run API requests and Insomnia-Documenter to generate static HTML to display documentation

