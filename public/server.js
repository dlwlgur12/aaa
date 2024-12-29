const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';
const PORT = process.env.PORT || 5000;

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ipo-trading-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => {
    console.error('MongoDB 연결 오류:', err); // MongoDB 연결 오류 로그 추가
    process.exit(1); // 서버 종료
  });

// CORS 설정
app.use(cors({
  origin: '*', // 모든 출처 허용 (필요 시 특정 출처로 제한 가능)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 기본 미들웨어
app.use(bodyParser.json());

// 사용자 스키마
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

const User = mongoose.model('User', userSchema);

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    req.user = user;
    next();
  });
};

// 로그인 API
app.post('/login', async (req, res) => {
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
});

// 회원가입 API
app.post('/signup', async (req, res) => {
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
  console.log(`서버가 http://localhost:${PORT}에서 실행 중`);
});