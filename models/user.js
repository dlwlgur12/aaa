// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },  // 사용자 이름
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    brokerage: { type: String, required: true },
    accountNumber: { type: String, required: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },  // 사용자 잔고
    stocks: { type: Array, default: [] }  // 사용자 보유 주식
});

module.exports = mongoose.model('user', userSchema);
