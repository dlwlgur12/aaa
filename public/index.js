document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
  
    document.getElementById('login-btn')?.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  
    document.getElementById('signup-btn')?.addEventListener('click', () => {
      window.location.href = 'signup.html';
    });
  
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      localStorage.removeItem('token');
      checkLoginStatus();
    });
  
    document.getElementById('my-assets')?.addEventListener('click', () => {
      window.location.href = 'balance.html';
    });
  });
  
  function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
      document.getElementById('auth-menu').style.display = 'block';
      document.getElementById('user-info').style.display = 'none';
      return;
    }
  
    fetch('/api/user', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(response => response.json())
      .then(data => {
        if (data.name) {
          document.getElementById('greeting-message').textContent = `${data.name}님, 반갑습니다!`;
          document.getElementById('balance').textContent = `잔고: ${data.balance}원`;
        }
        document.getElementById('auth-menu').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
      })
      .catch(() => {
        localStorage.removeItem('token');
        checkLoginStatus();
      });
  }
  