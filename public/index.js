// 로그인 상태 확인 및 사용자 정보 가져오기
const checkLoginStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      updateLoginStatus(false);
      return;
    }
  
    try {
        const response = await fetch('https://aaa-fawn-pi.vercel.app/api/user', {  // '/api/user' 로 수정
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          
  
      if (response.ok) {
        const userData = await response.json();
        updateLoginStatus(true, userData); // 사용자 정보 업데이트
      } else {
        updateLoginStatus(false);
      }
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 오류가 발생했습니다:', error);
      updateLoginStatus(false);
    }
  };
  
  // 로그인 상태에 따라 버튼을 변경하는 함수
  const updateLoginStatus = (isLoggedIn, userData) => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const welcomeMessage = document.getElementById('welcomeMessage');
  
    if (isLoggedIn && userData) {
      loginButton.style.display = 'none';
      signupButton.style.display = 'none';
      welcomeMessage.innerHTML = `${userData.name}님, 반갑습니다!`;  // 로그인한 사용자 이름 표시
    } else {
      loginButton.style.display = 'inline-block';
      signupButton.style.display = 'inline-block';
      welcomeMessage.innerHTML = '로그인 해주세요.';
    }
  };
  
  // 페이지 로드 시 로그인 상태 확인
  window.onload = checkLoginStatus;
  