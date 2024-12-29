window.addEventListener('load', async function () {
    const token = localStorage.getItem('token');
    const greetingMessage = document.getElementById('greeting-message');
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
  
    // 로그인 상태 확인
    if (token) {
      try {
        const response = await fetch('http://localhost:5000/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('토큰이 유효하지 않습니다.');
  
        const user = await response.json();
        greetingMessage.textContent = `${user.name}님, 반갑습니다!`;
        greetingMessage.style.display = 'inline';
        logoutBtn.style.display = 'inline';
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
  
        // 잔고 및 주식 데이터 업데이트
        document.getElementById('balance').textContent = `${user.balance.toLocaleString()}원`;
        const stockTable = document.getElementById('stock-table');
        user.stocks.forEach((stock) => {
          const row = `<tr>
            <td>${stock.symbol}</td>
            <td>${stock.quantity}</td>
            <td>${stock.assetValue.toLocaleString()}원</td>
          </tr>`;
          stockTable.insertAdjacentHTML('beforeend', row);
        });
      } catch (error) {
        console.error(error);
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('token');
        window.location.reload();
      }
    } else {
      logoutBtn.style.display = 'none';
    }
  
    // 로그아웃 처리
    logoutBtn.onclick = () => {
      localStorage.removeItem('token');
      window.location.reload();
    };
  
    // 로그인 및 회원가입 버튼 동작
    loginBtn.onclick = () => window.location.href = 'login.html';
    signupBtn.onclick = () => window.location.href = 'signup.html';
  });
  