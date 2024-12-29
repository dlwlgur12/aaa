document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('id').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name);  // 로그인 후 사용자 이름 저장
        window.location.href = 'index.html';  // 로그인 후 홈으로 이동
    } else {
        alert(data.message);
    }
});
