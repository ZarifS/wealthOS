import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const LinksSchema = new mongoose.Schema({
  accessToken: String,
  itemId: String
})

const AccountsSchema = new mongoose.Schema({
  name: String,
  balance: Number,
  institutionName: String,
  currency: String,
  type: String
})

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
    of: AccountsSchema
  },
  balance: {
    type: Number
  },
  holdings: {
    type: Number
  }
})

// Define schema methods
UserSchema.methods = {
  // Returns true if the password is correct
  checkPassword: function(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password)
  },
  // Creates a encrypted password for the user
  hashPassword: plainTextPassword => {
    return bcrypt.hashSync(plainTextPassword, 10)
  }
}

// Define hooks for pre-saving, ensure password is never added to database unencrypted
UserSchema.pre('save', function(next) {
  // Password is being updated
  if (this.isModified('password')) {
    console.log('Password was modified, encrypting.')
    this.password = this.hashPassword(this.password)
    next()
  }
  // Skip
  else next()
})

export default mongoose.model('User', UserSchema)
