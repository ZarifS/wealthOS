import * as Plaid from 'plaid';
import * as moment from 'moment';
import { PLAID_CLIENT_ID, PLAID_SECRET } from '../utils/secrets';

type TokenResponse = {
  itemId: string;
  accessToken: string;
};

// Plaid Types
export { AccountBase } from 'plaid';

// Initialize the Plaid client
const configuration = new Plaid.Configuration({
  basePath: Plaid.PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

const client = new Plaid.PlaidApi(configuration);

// Sandbox create a new public token
export const createPublicToken = async (
  institutionId = 'ins_37',
  initialProducts = [Plaid.Products.Transactions]
): Promise<string> => {
  const publicTokenRequest: Plaid.SandboxPublicTokenCreateRequest = {
    institution_id: institutionId,
    initial_products: initialProducts,
  };
  try {
    const tokenResponse = await client.sandboxPublicTokenCreate(publicTokenRequest);
    return tokenResponse.data.public_token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Exchange public token
export const exchangeToken = async (publicToken: string): Promise<TokenResponse> => {
  const tokenResponse = await client.itemPublicTokenExchange({ public_token: publicToken });
  return {
    itemId: tokenResponse.data.item_id,
    accessToken: tokenResponse.data.access_token,
  };
};

// Makes a call to the Plaids Transactions API for Account information for a given Item/Institution
export const getAccounts = async (accessToken: string): Promise<Plaid.AccountBase[]> => {
  // Last 30 Days
  const startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  // Call Plaid API Transactions
  const transactionsRequest: Plaid.TransactionsGetRequest = {
    access_token: accessToken,
    start_date: startDate,
    end_date: endDate,
  };
  const response = await client.transactionsGet(transactionsRequest, {
    count: 1,
    offset: 0,
  });
  return response.data.accounts;
};

// Makes a call to the Plaids Transactions API for a given Item/Institution
// export const getTransactions = async (accessToken: string, startDate, endDate) => {
//   let allTransactions: any[] = [];
//   const response = await client.transactionsGet(
//       {access_token: accessToken,
//         start_date: startDate,
//         end_date: endDate}
//   );
//   const transactions = response.data;
//   console.log("Total transactions for this range:", totalTransactions);
//   // Got all transactions
//   if (totalTransactions <= 500) return transactions;
//   // Need to paginate
//   allTransactions = allTransactions.concat(transactions);
//   // Grab next 500
//   let offset = 500;
//   while (allTransactions.length < totalTransactions) {
//     const result = await client.transactionsGet(accessToken, startDate, endDate, {
//       count: 500,
//       offset,
//     });
//     offset += 500;
//     allTransactions = allTransactions.concat(result.transactions);
//     console.log("Pulled more data, total data so far:", allTransactions.length);
//   }
//   // All transactions received
//   console.log("Total transactions pulled:", allTransactions.length);
//   return allTransactions;
// };

// export const getCategories = async (req, res) => {
//   try {
//     const {categories} = await client.getCategories();
//     const mainCategories: any = {};
//     categories.map((category: { hierarchy: any[]; }) => {
//       const top = category.hierarchy[0];
//       if (mainCategories[top]) {
//         for (const item of category.hierarchy) {
//           if (!mainCategories[top].includes(item)) mainCategories[top].push(item);
//         }
//         // let last = category.hierarchy[category.hierarchy.length - 1]
//         // if (!mainCategories[top].includes(last)) mainCategories[top].push(last)
//       } else mainCategories[top] = [];
//       return null;
//     });
//     return res.status(200).json({hierarchical: mainCategories, original: categories});
//   } catch (error: any) {
//     console.log(error);
//     return res.status(400).json({message: error.message});
//   }
// };

// export const removeItem = async (accessToken) => client.removeItem(accessToken);
