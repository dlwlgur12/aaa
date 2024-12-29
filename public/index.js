document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();

    // 로그인 버튼 클릭 시
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            window.location.href = 'login.html';  // 로그인 페이지로 이동
        });
    }

    // 회원가입 버튼 클릭 시
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function () {
            window.location.href = 'signup.html';  // 회원가입 페이지로 이동
        });
    }

    // 로그아웃 버튼 클릭 시
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('token');  // 로컬 스토리지에서 토큰 삭제
            checkLoginStatus();  // 로그인 상태 확인
        });
    }

    // 내 자산 버튼 클릭 시 발란스 페이지로 이동
    const myAssetsBtn = document.getElementById('my-assets');
    if (myAssetsBtn) {
        myAssetsBtn.addEventListener('click', function () {
            window.location.href = 'balance.html';  // 발란스 페이지로 이동
        });
    }
});

// 로그인 상태 확인 함수
function checkLoginStatus() {
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

        getUserInfo(token);  // 사용자 정보와 잔고를 가져오는 함수 호출

        if (greetingMessage) {
            greetingMessage.style.display = 'inline-block';  // 로그인 시 이름을 표시하기 위해 보이게 함
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

// 서버에서 사용자 정보 및 잔고를 가져오는 함수
function getUserInfo(token) {
    fetch('http://localhost:5000/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.name && data.balance !== undefined) {
            const greetingMessage = document.getElementById('greeting-message');
            const balanceElement = document.getElementById('balance');

            if (greetingMessage) {
                greetingMessage.textContent = `${data.name}님, 반갑습니다!`;  // 사용자 이름
            }
            if (balanceElement) {
                balanceElement.textContent = `잔고: ${data.balance}원`;  // 잔고 표시
            }
        } else {
            console.error('사용자 정보가 부족합니다.');
        }
    })
    .catch(error => {
        console.error('사용자 정보를 가져오는 데 오류가 발생했습니다:', error);
    });
}
