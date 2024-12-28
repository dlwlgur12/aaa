// api/signup.js
module.exports = (req, res) => {
    if (req.method === "POST") {
      // 회원가입 로직 처리
      const { email, password } = req.body;
  
      // 예: 이메일과 비밀번호로 회원가입 처리 (여기서는 단순히 성공 메시지만 보냄)
      res.status(200).json({ message: "회원가입 성공!", email: email });
    } else {
      res.status(405).json({ message: "잘못된 요청 방식. POST만 허용됩니다." });
    }
  };
  