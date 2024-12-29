const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// 서버에서 사용자 정보 및 잔고를 가져오는 함수
module.exports = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: '토큰이 필요합니다.' });
    }
  
    try {
      // JWT 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
      // 'id' 필드를 사용하여 찾기
      const user = await User.findOne({ id: userId }).select('name balance stocks');
  
      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
  
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
  
