const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

// 사용자 정보 가져오기 API
router.get('/', authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).select('name balance stocks');
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      name: user.name,
      balance: user.balance,
      stocks: user.stocks,
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
});

module.exports = router;
