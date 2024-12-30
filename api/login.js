const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');  // User 모델
require('dotenv').config(); // .env 파일에서 환경 변수 로드

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

module.exports = async (req, res) => {
  const { id, password } = req.body;

  // 요청이 제대로 들어왔는지 확인
  if (!id || !password) {
    return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
  }

  try {
    // 아이디로 사용자 찾기
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(400).json({ message: '등록되지 않은 아이디입니다.' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,  // 환경 변수에서 secret 가져오기
      { expiresIn: '1h' }      // 1시간 후 만료
    );

    res.json({ message: '로그인 성공', token, name: user.name });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
};
