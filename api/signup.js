const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');  // 정확한 소문자 경로로 수정

// 데이터베이스 연결 설정
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(error => {
        console.error('Database connection error:', error);
        process.exit(1);
    });

module.exports = async (req, res) => {
  const { id, name, email, phone, brokerage, accountNumber, password } = req.body;

  if (!id || !name || !email || !phone || !brokerage || !accountNumber || !password) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    console.log('Request received:', req.body);

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
    console.log('New user created:', newUser);
    res.json({ message: '회원가입 성공' });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
};
