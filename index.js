document.getElementById('start-game').addEventListener('click', () => {
    const player1Name = document.getElementById('player1-name').value.trim();
    const player2Name = document.getElementById('player2-name').value.trim();

    if (!player1Name || !player2Name) {
        alert('Please enter both player names.');
        return;
    }
    
    localStorage.setItem('player1', player1Name);
    localStorage.setItem('player2', player2Name);
    window.location.href = 'select-category.html';
    
});

