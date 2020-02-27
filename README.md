# Wealth-X

A new method of tracking personal finance. Data driven and a clean beautiful interface. Built using NodeJS, React-Native. Class project for CSI3140 with Andrew Forward.

## Main Idea
Create a unified user experience to give a total overview on a users financial health. Allow users to link their institutional accounts, view their balances and owings, manage their budgets and subscriptions.

## Phase 1 - Scope
### 1.1 Accounts Overview
* Allow users to connect their bank account and other institutional accounts to the application
* Gives them a overview of their depository accounts as well as their balances - net worth
### 1.2 Budget Planner
* Allows them to create a budget, split into daily intervals that updates real-time based on bank transactions
* App will allow the user to see their spending habits using categories and get insights into their spendings

## Course Goals 
For the purpose of this course I believe 1.1 will be able to be implemented fully. I do not think 1.2 will be able to be completed within just the 4 months but I can have some of the backend work done since it is usually the front end which takes the most time.

Currently some of the backend work has been done like logging in with a JWT, getting user account info through REST and getting some transactions data. Also some basic CRUD. This has set me up to work on creating a MVP of the client side application which will be built using ReactNative which is perfect for this course since it is basically javascript HTML.

I have also created some UX mockups using AdobeXD which I will translate into HTML/CSS for Deliverable 1 and then work on building out throughout the term. I don't think I'll be able to build out the full app since the scale is very big but at least some core functionality for the purpose of this course.

## Students
Zarif Shahriar, 8177206
Pasoon Azimi, 8215497

## Project Deliverables
### Deliverable 1 - Project Definition
### Deliverable 2 - Project Mockups
### Deliverable 3 - Technology Landspace
### Deliverable 4 - Features
### Deliverable 5 - Version 1.0 of Application

## WIKI 
More information on the project archeticture can be found on the Wiki.

## Installation and Deployment Instructions (Getting Started)

Clone the repo into your workspace,

Install watchman and react-native,

`brew install watchman`

`sudo npm install -g react-native-cli`

If you are on Windows download and install Android studio,

If you are on Mac download and install Xcode, and install the command line tools,

`xcode-select --install`

Go into xcode preferences -> Locations and make sure xcode version is shown beside command line tools,

Cd into wealth-OS-server,

`npm install`

`npm start`

Cd into wealth-OS-app,

`npm install`

`npm start`

Cd into ios,  

`pod update`

`pod install`

Cd into wealth-OS-app,

`react-native run-ios` or `react-native run-android`

## Technical Overview

- The application architecture is written using NodeJS with ExpressJS and MongoDB as the database provider
- The application uses bCrypt for encrypting passwords
- The application uses Mongoose to interface with MongoDB models and items
- In order to gather information from a users bank or institution the app uses Plaid's NodeJS solution

### Database Design

Each database follows the mongoose model principles.

### User Model

- This is the main user database
- When a user signs up a new record is created
- A users links item holds the institutions a user has linked via plaid
- Holds a snapshot of the users balances and holdings alongside a map of the users accounts
- When a user links a account via plaid, a record is also created or updated in the itemLinks model

### Schema Design

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

### User Accounts

    let Account = {
          name: name,
          balance: balances.current,
          type: type,
          currency: balances.iso_currency_code,
          mask: mask, // Last 4 digits of the users account
          accountId: account_id // Account ID based on Plaid's API
        }

### User Links

    // Holds the Plaid accessToken needed to access the itemId associated with the item
    let link = {
      accessToken: String, /
    	// Returned with a link, used to access information for a certain institution with the itemID
      itemId: String
    }

### ItemLink Model

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

### Schema Design

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

## API Documentation

- The api documentation can be found here: [https://zarifs.github.io/wealthOS/](https://zarifs.github.io/wealthOS/)
- Utilizes Insomnia to test and run API requests and Insomnia-Documenter to generate static HTML to display documentation


## UI Design System

### Color Palette
![Image of Color Palette](./mockups/ui-design-images/color-ui.png)
### Fonts and Type Scale
![Image of Font and Type Scale](./mockups/ui-design-images/font-ui.png)
### Icons
![Image of Icons](./mockups/ui-design-images/icons-ui.png)
### Buttons and Form Elements
![Image of Icons](./mockups/ui-design-images/buttons-forms-ui.png)
### UI Components
![Image of Components](./mockups/ui-design-images/components-ui.png)
