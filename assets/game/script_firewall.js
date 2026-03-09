let score = 0;
let lives = 3;
let currentPacket = null;
let gameInterval;
let packetSpeed = 2;

function createPacket() {
    if (lives <= 0) return;

    const types = [
        { status: 'safe', color: '#27ae60', icon: '✉️' },
        { status: 'danger', color: '#e74c3c', icon: '☣️' }
    ];
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const packetEl = document.createElement('div');
    packetEl.className = 'packet';
    packetEl.style.backgroundColor = randomType.color;
    packetEl.innerHTML = randomType.icon;
    packetEl.style.top = '0px';
    
    document.getElementById('play-area').appendChild(packetEl);
    
    currentPacket = {
        el: packetEl,
        status: randomType.status,
        y: 0
    };
}

function gameLoop() {
    if (currentPacket) {
        currentPacket.y += packetSpeed;
        currentPacket.el.style.top = currentPacket.y + 'px';

        // Jika paket menyentuh server (Lolos)
        if (currentPacket.y > 350) {
            if (currentPacket.status === 'danger') {
                lives--;
                alert("Ouch! Server terinfeksi Virus!");
            }
            removePacket();
            createPacket();
            updateUI();
        }
    } else {
        createPacket();
    }
}

function handleAction(action) {
    if (!currentPacket) return;

    if (action === 'allow' && currentPacket.status === 'safe') {
        score += 10;
    } else if (action === 'drop' && currentPacket.status === 'danger') {
        score += 10;
    } else {
        lives--;
        alert("Salah Keputusan! Nyawa berkurang.");
    }

    removePacket();
    createPacket();
    updateUI();
}

function removePacket() {
    if (currentPacket && currentPacket.el) {
        currentPacket.el.remove();
        currentPacket = null;
    }
}

function updateUI() {
    document.getElementById('score').innerText = score;
    document.getElementById('lives').innerText = lives;

    if (lives <= 0) {
        clearInterval(gameInterval);
        alert("GAME OVER! Skor Akhir Anda: " + score);
        location.reload();
    }
}

gameInterval = setInterval(gameLoop, 20);