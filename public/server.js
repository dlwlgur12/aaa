// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// MongoDB 연결 (클러스터 URL 사용)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 오류:', err));

// CORS 설정
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 미들웨어
app.use(bodyParser.json());

// user 모델을 소문자로 변경하여 불러옴
const User = require('./models/user');

// 사용자 관련 API
const userRoutes = require('./api/user');
app.use('/api/user', userRoutes);

// 사용자 로그인 API
app.post('/api/login', async (req, res) => {
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

    res.json({
      message: '로그인 성공',
      token,
      name: user.name,
      balance: user.balance,
      stocks: user.stocks,
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
});

// 회원가입 API
app.post('/api/signup', async (req, res) => {
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
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
