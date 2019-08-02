import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const LinksSchema = new mongoose.Schema({
  access_token: String,
  item_id: String
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
  // Password is not being updated
  if (!this.password) {
    return next()
  }
  // Encrypt provided password
  this.password = this.hashPassword(this.password)
  next()
})

export default mongoose.model('User', UserSchema)
