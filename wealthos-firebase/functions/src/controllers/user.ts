import {db as Database} from "../utils/firebase";
// import * as Plaid from "./plaid";
type Link = {
  accessToken: string,
  institutionName?: string
}

type Transactions = {
  _id: string,
  name: string,
  category: string[],
  amount: number,
  accountId: string,
  date: Date,
  pending: boolean,
  pendingId?: string
  currency: string,
  aggregated: boolean,
  cash: boolean,
}

export type User = {
    firstName?: string,
    lastName?: string,
    email: string,
    links: Record<string, Link>
    balance: number,
    transactions: Transactions[],
    accounts: Record<string, any>
}

// Get user collection slice from database
export const db = Database.users;

/**
 * Retrieve a user from the database
 * @param {String} userId:
 * @return {Promise<User | undefined>}
 */
export async function getUserById(userId: string): Promise<User | undefined> {
  try {
    const user = (await db.doc(userId).get()).data();
    if (user) {
      return user;
    } else return undefined;
  } catch (error) {
    console.error("Error trying to get user:", error);
    throw error;
  }
}


/**
 * Create a new user with a specific docId or a random docId if not
 * provided.
 * @export
 * @param {(string | undefined)} userId
 * @param {Partial<User>} data
 * @return {Promise<FirebaseFirestore.WriteResult>}
 */
export async function createUser(userId: string | undefined, data: Partial<User>):
Promise<FirebaseFirestore.WriteResult> {
  try {
    if (userId) {
      return await db.doc(userId).set({
        email: data.email as string,
        firstName: data.firstName,
        lastName: data.lastName,
        links: {},
        balance: 0,
        transactions: [],
        accounts: {},
      });
    } else {
      return await db.doc().set({
        email: data.email as string,
        firstName: data.firstName,
        lastName: data.lastName,
        links: {},
        balance: 0,
        transactions: [],
        accounts: {},
      });
    }
  } catch (error) {
    console.log("Error trying to create a new user", error);
    throw error;
  }
}

/**
 * Replaces a users documents field(s) with data that is provided
 * @param {string} userId
 * @param {Partial<User>} data
 * @return {Promise<FirebaseFirestore.WriteResult>}
 */
export async function updateUser(userId:string, data: Partial<User>):
 Promise<FirebaseFirestore.WriteResult> {
  try {
    return await db.doc(userId).update(data);
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
}

// export async function getAccounts(user: User) {
//   try {
//     // eslint-disable-next-line guard-for-in
//     for (const key in user.links) {
//       const {accessToken, institutionName} = user.links[key];
//       // First update all account balances
//       const accounts = await Plaid.getAccounts(accessToken);
//       user = setUserAccounts(user, accounts, institutionName);
//     }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// // Add new institution accounts to the User
// const setUserAccounts = (user: User, accounts: any, institutionName: any) => {
//   // Setup user accounts for each account associated with the Plaid item
//   const newAccounts: any = [];
//   accounts.forEach((account: any) => {
//     const {account_id: accountId, balances, name, type, mask} = account;
//     const newAccount = {
//       name,
//       balance: balances.current,
//       type,
//       currency: balances.iso_currency_code,
//       mask,
//       accountId,
//       // lastUpdated: moment(Date.now()).format("YYYY-MM-DD, h:mm:ss a"),
//     };
//     newAccounts.push(newAccount);
//   });
//   user.accounts[institutionName] = newAccounts;

//   // Recalculate the users current balance
//   user.balance = calculateUserBalance(user.accounts);

//   return user;
// };

// // Whenever accounts are modified, update.
// const calculateUserBalance = (accounts: any) => {
//   let sum = 0;
//   accounts.forEach((institution: any) => {
//     institution.forEach((account: any) => {
//       const {balance, type} = account;
//       if (type === "depository") {
//         sum += balance;
//       } else if (type === "credit") {
//         sum -= balance;
//       }
//     });
//   });
//   return sum;
// };
