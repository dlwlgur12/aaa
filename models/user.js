const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // 사용자 식별자
  name: { type: String, required: true },            // 이름
  email: { type: String, required: true },           // 이메일
  phone: { type: String },                           // 전화번호
  brokerage: { type: String },                       // 증권사
  accountNumber: { type: String },                   // 계좌번호
  password: { type: String, required: true },        // 비밀번호
  balance: { type: Number, default: 0 },             // 잔고
  stocks: { type: Array, default: [] },              // 보유 주식
}, { timestamps: true });                            // 생성, 수정 시간 자동 관리

module.exports = mongoose.model('User', userSchema);
