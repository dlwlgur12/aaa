// api/login.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // User 모델을 불러옵니다.
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

module.exports = async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
  }

  try {
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = jwt.sign({ userId: user._id, id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: '로그인 성공', token, name: user.name, balance: user.balance, stocks: user.stocks });
  } catch (error) {
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
};
