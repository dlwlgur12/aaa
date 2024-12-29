const mongoose = require('mongoose');
const User = require('../models/user');
const authenticateToken = require('../utils/authenticateToken');  // JWT 인증 미들웨어

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json({
      name: user.name,
      balance: user.balance,
      stocks: user.stocks || [],
    });
  } catch (error) {
    console.error('Error during user lookup:', error);
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
};
