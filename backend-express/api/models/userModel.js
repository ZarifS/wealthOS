import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Holds the Plaid accessToken needed to access the itemId associated with the item
const LinksSchema = new mongoose.Schema({
  accessToken: String,
  itemId: String
});

const TransactionsSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: Array,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  accountID: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  },
  pending_id: {
    type: String
  },
  currency: {
    type: String,
    required: true
  },
  aggregated: {
    type: Boolean,
    default: true
  },
  cash: {
    type: Boolean,
    default: false
  }
});

// Define User Schema
const UserSchema = new mongoose.Schema({
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
  },
  date: {
    type: Date,
    default: Date.now
  },
  links: {
    type: Map,
    of: LinksSchema
  },
  accounts: {
    type: Map,
    of: Array
  },
  balance: {
    type: Number
  },
  holdings: {
    type: Number
  },
  transactions: [TransactionsSchema]
});

// Define schema methods
UserSchema.methods = {
  // Returns true if the password is correct
  checkPassword(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  },
  // Creates a encrypted password for the user
  hashPassword: plainTextPassword => bcrypt.hashSync(plainTextPassword, 10)
};

// Define hooks for pre-saving, ensure password is never added to database unencrypted
UserSchema.pre('save', function(next) {
  // Password is being updated
  if (this.isModified('password')) {
    console.log('Password was modified, encrypting.');
    this.password = this.hashPassword(this.password);
    next();
  }
  // Skip
  else next();
});

export default mongoose.model('User', UserSchema);
