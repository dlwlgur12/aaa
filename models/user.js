// /models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // 아이디 (예: 이메일)
  name: { type: String, required: true }, // 이름
  email: { type: String, required: true, unique: true }, // 이메일
  password: { type: String, required: true }, // 비밀번호 (해시화된)
});

module.exports = mongoose.model('User', userSchema);
