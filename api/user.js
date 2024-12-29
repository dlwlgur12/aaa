const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports = async (req, res) => {
  // Authorization 헤더에서 JWT 토큰을 가져옵니다.
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '토큰이 필요합니다. Authorization 헤더에서 Bearer 토큰을 포함해 주세요.' });
  }

  try {
    // JWT 토큰을 검증하여 userId를 추출합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // 해당 userId로 사용자 정보를 가져옵니다.
    const user = await User.findById(userId).select('name balance stocks');

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다. 사용자 ID를 확인하세요.' });
    }

    // 사용자 정보와 함께 응답을 반환합니다.
    res.json({
      name: user.name,
      balance: user.balance,
      stocks: user.stocks,
    });
  } catch (error) {
    console.error('사용자 정보를 가져오는 도중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
};
