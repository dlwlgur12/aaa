// login.js (클라이언트 코드)
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('id').value;  // 아이디 (이메일 등)
    const password = document.getElementById('password').value;  // 비밀번호

    try {
        const response = await fetch('https://aaa-fawn-pi.vercel.app/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // 로그인 성공 시
            localStorage.setItem('token', data.token); // JWT 토큰 저장
            localStorage.setItem('name', data.name);   // 사용자 이름 저장
            window.location.href = 'index.html';  // 홈 페이지로 리디렉션
        } else {
            alert(data.message);  // 실패 메시지 출력
        }
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        alert('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
});
