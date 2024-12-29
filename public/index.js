async function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
      updateLoginStatus(null); // 로그인 상태 초기화
      return;
    }
  
    try {
      const response = await fetch('https://aaa-fawn-pi.vercel.app/api/user', { // 정확한 API 경로
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
  
      const userInfo = await response.json();
      updateLoginStatus(userInfo);
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 오류가 발생했습니다:', error);
      updateLoginStatus(null); // 오류 발생 시 초기화
    }
  }
  
  function updateLoginStatus(userInfo) {
    const loginButton = document.getElementById('login-button');
    const userName = document.getElementById('user-name');
  
    if (!loginButton || !userName) {
      console.error('필요한 DOM 요소를 찾을 수 없습니다.');
      return;
    }
  
    if (userInfo) {
      loginButton.style.display = 'none';
      userName.textContent = `${userInfo.name}님`;
      userName.style.display = 'block';
    } else {
      loginButton.style.display = 'block';
      userName.style.display = 'none';
    }
  }
  
  // DOMContentLoaded 후 checkLoginStatus 호출
  document.addEventListener('DOMContentLoaded', checkLoginStatus);
  