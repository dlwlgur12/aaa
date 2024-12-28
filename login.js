// /api/login.js

module.exports = (req, res) => {
    if (req.method === 'POST') {
      const { email, password } = req.body;
      // 로그인 처리 로직 (예: 데이터베이스에서 유저 확인)
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  };
  