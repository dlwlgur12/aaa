// 로그인 버튼 클릭 시
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', function () {
        window.location.href = 'login.html';  // 로그인 페이지로 이동
    });
}

// 로그인 후, 사용자 이름 및 잔고 처리
function handleLoginResponse(data) {
    const token = data.token;
    const name = data.name; // 서버에서 받은 사용자 이름
    const balance = data.balance;

    // 로컬 스토리지에 토큰 저장
    localStorage.setItem('token', token);

    // 로그인 상태 확인 함수 호출
    checkLoginStatus(name, balance);
}

// 로그인 함수
function login(id, password) {
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // 로그인 성공 시 사용자 정보를 처리하는 함수 호출
            handleLoginResponse(data);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('로그인 오류:', error);
    });
}

// 로그인 상태 확인 함수
function checkLoginStatus(name, balance) {
    const token = localStorage.getItem('token');
    const greetingMessage = document.getElementById('greeting-message');
    const balanceElement = document.getElementById('balance');
    const authMenu = document.getElementById('auth-menu');
    const logoutBtn = document.getElementById('logout-btn');
    const myAssets = document.getElementById('my-assets');

    if (token) {
        // 로그인 상태일 경우
        authMenu.style.display = 'none';  // 로그인/회원가입 버튼 숨기기
        logoutBtn.style.display = 'inline-block';  // 로그아웃 버튼 보이기
        myAssets.style.display = 'inline-block';  // 내 자산 버튼 보이기
        if (greetingMessage) {
            greetingMessage.style.display = 'inline-block';  // 로그인 시 이름을 표시하기 위해 보이게 함
            greetingMessage.textContent = `${name}님, 반갑습니다!`;  // 사용자 이름
        }
        if (balanceElement) {
            balanceElement.textContent = `잔고: ${balance}`;  // 잔고 표시
        }
    } else {
        // 로그인 안 된 상태일 경우
        if (greetingMessage) {
            greetingMessage.style.display = 'none';  // 로그인되지 않은 상태에서는 인사 메시지 숨기기
        }
        if (balanceElement) {
            balanceElement.style.display = 'none';  // 잔고 숨기기
        }
        logoutBtn.style.display = 'none';  // 로그아웃 버튼 숨기기
        authMenu.style.display = 'block';  // 로그인/회원가입 버튼 보이기
        myAssets.style.display = 'none';  // 내 자산 버튼 숨기기
    }
}
