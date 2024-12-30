const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  brokerage: { type: String, required: true },
  accountNumber: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  stocks: [{
    symbol: String,
    name: String,
    logoUrl: String,
    quantity: Number,
    assetValue: Number,
    listingDate: Date,
    subscriptionDate: Date,
  }],
});

module.exports = mongoose.model('User', userSchema);
