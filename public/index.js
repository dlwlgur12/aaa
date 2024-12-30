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

        getUserInfo(token)  // 사용자 정보와 잔고를 가져오는 함수 호출
            .then(data => updateUIWithUserInfo(data))
            .catch(() => {
                console.error('사용자 정보를 불러오는 데 실패했습니다.');
                resetUI();  // 실패 시 UI 초기화
            });
    } else {
        resetUI();  // 로그인되지 않은 상태의 UI
    }
}

// UI 초기화 함수
function resetUI() {
    const greetingMessage = document.getElementById('greeting-message');
    const balanceElement = document.getElementById('balance');
    const authMenu = document.getElementById('auth-menu');
    const logoutBtn = document.getElementById('logout-btn');
    const myAssets = document.getElementById('my-assets');

    if (greetingMessage) greetingMessage.style.display = 'none';
    if (balanceElement) balanceElement.style.display = 'none';
    if (authMenu) authMenu.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (myAssets) myAssets.style.display = 'none';
}

// 사용자 정보를 UI에 업데이트하는 함수
function updateUIWithUserInfo(data) {
    const greetingMessage = document.getElementById('greeting-message');
    const balanceElement = document.getElementById('balance');

    if (data.name && data.balance !== undefined) {
        if (greetingMessage) {
            greetingMessage.textContent = `${data.name}님, 반갑습니다!`;  // 사용자 이름
            greetingMessage.style.display = 'inline-block';
        }
        if (balanceElement) {
            balanceElement.textContent = `잔고: ${data.balance.toLocaleString()}원`;  // 잔고 표시
            balanceElement.style.display = 'inline-block';
        }
    } else {
        console.error('사용자 정보가 충분하지 않습니다.');
    }
}

// 서버에서 사용자 정보 및 잔고를 가져오는 함수
function getUserInfo(token) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);  // 10초 타임아웃 설정

    return fetch('https://aaa-fawn-pi.vercel.app/api/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal,  // 타임아웃과 연결된 신호 추가
    })
        .then(response => {
            clearTimeout(timeoutId);  // 응답이 오면 타임아웃 해제
            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            clearTimeout(timeoutId);  // 오류 발생 시 타임아웃 해제
            if (error.name === 'AbortError') {
                console.error('요청이 시간 초과되었습니다.');
            } else {
                console.error('사용자 정보를 가져오는 데 오류가 발생했습니다:', error);
            }
            throw error;
        });
}
