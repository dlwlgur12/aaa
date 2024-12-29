// 필요한 패키지들
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');  // 정확한 경로로 수정 (대소문자 구분)

// dotenv 패키지를 사용하여 환경 변수 로드 (로컬 환경에서만 필요)
require('dotenv').config();

// MongoDB URI 로드
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MongoDB URI is not defined in the environment variables');
  process.exit(1);  // 환경 변수가 없으면 서버 종료
}

// 데이터베이스 연결 설정
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(error => {
    console.error('Database connection error:', error.message);
    process.exit(1); // 데이터베이스 연결 실패 시 서버 종료
  });

// 회원가입 처리 함수
module.exports = async (req, res) => {
  const { id, name, email, phone, brokerage, accountNumber, password } = req.body;

  // 필수 필드 확인
  if (!id || !name || !email || !phone || !brokerage || !accountNumber || !password) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    console.log('Request received:', req.body);

    // 기존 사용자 확인 (아이디 또는 이메일 중복 확인)
    const existingUser = await User.findOne({ $or: [{ email }, { id }] });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디나 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성
    const newUser = new User({
      id,
      name,
      email,
      phone,
      brokerage,
      accountNumber,
      password: hashedPassword,
      balance: 0,  // 초기 잔액은 0으로 설정
      stocks: [],  // 초기 보유 주식은 빈 배열로 설정
    });

    // 사용자 저장
    await newUser.save();
    console.log('New user created:', newUser);

    // 성공 응답
    res.json({ message: '회원가입 성공' });
  } catch (error) {
    console.error('Error during user signup:', error.message);
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
};
