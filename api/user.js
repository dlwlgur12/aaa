const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports = async (req, res) => {
  console.time('api-user'); // 타이머 시작
  console.log('Request received at:', new Date().toISOString());

  const token = req.headers['authorization']?.split(' ')[1]; // Bearer 토큰에서 실제 토큰 추출

  if (!token) {
    console.warn('No token provided');
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  try {
    console.log('Token provided:', token);
    // JWT 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    const userId = decoded.userId; // JWT에서 추출한 사용자 ID

    console.log('Decoded userId:', userId);
    // 사용자 정보 조회
    const user = await User.findOne({ id: userId }, 'name balance stocks');
    console.log('User found:', user);

    if (!user) {
      console.warn('User not found for userId:', userId);
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자 정보 응답
    res.json({
      name: user.name,        // 사용자 이름
      balance: user.balance,  // 사용자 잔고
      stocks: user.stocks,    // 사용자 보유 주식
    });
  } catch (error) {
    console.error('Error during fetching user info:', error); // 서버 로그 기록
    res.status(500).json({ message: '알 수 없는 서버 오류가 발생했습니다.' }); // 사용자에게는 상세 정보 노출 금지
  } finally {
    console.timeEnd('api-user'); // 타이머 종료 및 로그 출력
  }
};
