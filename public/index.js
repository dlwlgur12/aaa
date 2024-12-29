document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('token');
            checkLoginStatus();
        });
    }
});

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const greetingMessage = document.getElementById('greeting-message');
    const balanceElement = document.getElementById('balance');
    const logoutBtn = document.getElementById('logout-btn');

    if (token) {
        logoutBtn.style.display = 'inline-block';
        getUserInfo(token);
        if (greetingMessage) {
            greetingMessage.style.display = 'inline-block';
        }
    } else {
        if (greetingMessage) {
            greetingMessage.style.display = 'none';
        }
        if (balanceElement) {
            balanceElement.style.display = 'none';
        }
        logoutBtn.style.display = 'none';
        window.location.href = 'login.html';  // 로그인 페이지로 리다이렉트
    }
}

function getUserInfo(token) {
    fetch('https://aaa-fawn-pi.vercel.app/api/user', {  // Vercel 배포 주소로 수정
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('서버 오류: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.balance !== undefined) {
            const greetingMessage = document.getElementById('greeting-message');
            const balanceElement = document.getElementById('balance');
            const stocksElement = document.getElementById('assets-container');

            if (greetingMessage) {
                greetingMessage.textContent = `${data.name}님, 반갑습니다!`;
                greetingMessage.style.display = 'inline-block';
            }
            if (balanceElement) {
                balanceElement.style.display = 'inline-block';
                balanceElement.textContent = `잔고: ₩${data.balance.toLocaleString()}`;
            }

            if (stocksElement) {
                if (data.stocks && Array.isArray(data.stocks) && data.stocks.length > 0) {
                    data.stocks.forEach(stock => {
                        const stockItem = document.createElement('div');
                        stockItem.classList.add('asset-card');
                        stockItem.innerHTML = `
                            <img src="${stock.logoUrl}" alt="${stock.name} 로고">
                            <h3>${stock.name}</h3>
                            <p>상장 예정일: ${new Date(stock.listingDate).toLocaleDateString()}</p>
                            <p>청약 예정일: ${new Date(stock.subscriptionDate).toLocaleDateString()}</p>
                            <p>자산 가치: ₩${stock.assetValue.toLocaleString()}</p>
                            <p>수량: ${stock.quantity}</p>
                        `;
                        stocksElement.appendChild(stockItem);
                    });
                } else {
                    stocksElement.innerHTML = '<p>보유한 자산이 없습니다.</p>';
                }
            }
        }
    })
    .catch(error => {
        console.error('자산 정보를 가져오는 데 오류가 발생했습니다:', error);
    });
}
