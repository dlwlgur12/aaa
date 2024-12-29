document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const accountNumber = document.getElementById('account').value;
    const brokerage = document.getElementById('brokerage').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // 비밀번호 확인
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    try {
        const response = await fetch('https://aaa-fawn-pi.vercel.app/api/signup', {  // 수정된 부분
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                name,
                phone,
                accountNumber,
                brokerage,
                email,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('회원가입 성공!');
            window.location.href = 'login.html'; // 로그인 페이지로 리다이렉트
        } else {
            alert(`회원가입 실패: ${data.message}`);
        }
    } catch (error) {
        alert(`오류 발생: ${error.message}`);
    }
});
