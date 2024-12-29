const jwt = require('jsonwebtoken');
const User = require('../models/user');  // User 모델
require('dotenv').config();  // 환경 변수 로드

module.exports = async (req, res) => {
  // Authorization 헤더에서 JWT 토큰을 가져옵니다.
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '토큰이 필요합니다.' });
  }

  try {
    // JWT 토큰을 검증하여 userId를 추출합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // 해당 userId로 사용자 정보를 가져옵니다.
    const user = await User.findById(userId).select('name balance stocks');  // 필요 정보만 선택

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자 정보와 함께 응답을 반환합니다.
    res.json({
      name: user.name,
      balance: user.balance,
      stocks: user.stocks,
    });
  } catch (error) {
    console.error('Error during fetching user info:', error);
    res.status(500).json({ message: '서버 오류: ' + error.message });
  }
};
