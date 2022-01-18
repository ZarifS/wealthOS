import * as moment from "moment";
import {db as Database} from "../utils/firebase";
import * as Plaid from "./plaid";

type Link = {
  accessToken: string,
  institutionName: string,
  institutionId: string,
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
    uuid: string,
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
 * Create a new user with a specific docId matching authentications uuid
 * @export
 * @param {string} uuid firebase auth uuid
 * @param {Partial<User>} data
 * @return {Promise<FirebaseFirestore.WriteResult>}
 */
export async function createUser(uuid: string, data: Partial<User>):
Promise<FirebaseFirestore.WriteResult> {
  try {
    if (!uuid) throw new Error("Missing or invalid uuid.");
    return await db.doc(uuid).set({
      email: data.email as string,
      firstName: data.firstName,
      lastName: data.lastName,
      links: {},
      balance: 0,
      transactions: [],
      accounts: {},
      uuid,
    });
  } catch (error) {
    console.error("Error trying to create a new user:", error);
    throw error;
  }
}

/**
 * Replaces a users document field(s) with data that is provided
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

/**
 * Fetches and updates all account balances for a user
 * @export
 * @param {User} user
 */
export async function fetchAndUpdateAccounts(user: User) {
  try {
    for (const key in user.links) {
        const {accessToken, institutionName} = user.links[key];
        // First get the account balances for this accessToken
        const accounts = await Plaid.getAccounts(accessToken);
        // Update the user.accounts with the new information
        user.accounts[institutionName] = accounts.map(account => {
          return {
            name: account.name,
            balance: account.balances.current,
            type: account.type,
            currency: account.balances.iso_currency_code,
            mask: account.mask,
            accountId: account.account_id,
            lastUpdated: moment(Date.now()).format("YYYY-MM-DD, h:mm:ss a"),
          };
        });
    }
    // All user accounts updated, update balance
    return await updateUser(user.uuid, {accounts: user.accounts});
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Whenever accounts are modified, update.
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
