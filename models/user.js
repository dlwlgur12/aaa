// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  brokerage: { type: String, required: true },
  accountNumber: { type: String, required: true },
  password: { type: String, required: true },  // 암호화된 비밀번호
  balance: { type: Number, default: 0 },
  stocks: [
    {
      symbol: String,
      name: String,
      logoUrl: String,
      quantity: Number,
      assetValue: Number,
      listingDate: Date,
      subscriptionDate: Date,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema); // 모델 이름을 소문자로 변경
