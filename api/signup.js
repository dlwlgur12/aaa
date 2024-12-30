const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user'); 
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

module.exports = async (req, res) => {
  const { id, name, email, phone, brokerage, accountNumber, password } = req.body;

  if (!id || !name || !email || !phone || !brokerage || !accountNumber || !password) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { id }] });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디나 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      id,
      name,
      email,
      phone,
      brokerage,
      accountNumber,
      password: hashedPassword,
      balance: 0,
      stocks: [],
    });

    await newUser.save();
    res.json({ message: '회원가입 성공' });
  } catch (error) {
    console.error('Error during user signup:', error.message);
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
};
