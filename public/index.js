document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
  });
  
  async function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
      updateLoginStatus(false);
      return;
    }
  
    try {
      const response = await fetch('https://aaa-fawn-pi.vercel.app/user', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
  
      const data = await response.json();
      updateLoginStatus(true, data);
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 오류가 발생했습니다:', error);
      updateLoginStatus(false);
    }
  }
  
  function updateLoginStatus(isLoggedIn, userInfo = {}) {
    const loginStatusDiv = document.getElementById('login-status');
    const loginButton = document.getElementById('login-btn');
    const signupButton = document.getElementById('signup-btn');
  
    if (!loginStatusDiv || !loginButton || !signupButton) {
      console.error('필요한 DOM 요소를 찾을 수 없습니다.');
      return;
    }
  
    if (isLoggedIn) {
      loginStatusDiv.style.display = 'block';
      loginStatusDiv.innerText = `환영합니다, ${userInfo.name}님!`;
      loginButton.style.display = 'none';
      signupButton.style.display = 'none';
    } else {
      loginStatusDiv.style.display = 'none';
      loginButton.style.display = 'block';
      signupButton.style.display = 'block';
    }
  }
  