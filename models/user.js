// api/user.js

const User = require('./user');
const authenticateToken = require('../utils/authenticateToken');  // JWT 인증 미들웨어

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
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
};
