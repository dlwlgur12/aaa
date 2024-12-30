const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer 토큰에서 실제 토큰 추출

  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  try {
    // JWT 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // 사용자 정보 조회
    const user = await User.findById(userId).select('name balance stocks');

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자 정보 응답
    res.json({
      name: user.name,  // 사용자 이름
      balance: user.balance,  // 사용자 잔고
      stocks: user.stocks,  // 사용자 보유 주식
    });
  } catch (error) {
    console.error('Error during fetching user info:', error); // 서버 로그 기록
    res.status(500).json({ message: '알 수 없는 서버 오류가 발생했습니다.' }); // 사용자에게는 상세 정보 노출 금지
  }
};
