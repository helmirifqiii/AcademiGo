const cases = [
    { title: "Kasus #1: PC Mati Total", description: "Saat tombol power ditekan, tidak ada suara kipas dan lampu indikator mati. Apa langkah awalnya?", options: ["Ganti RAM", "Cek Kabel Power & PSU", "Install Ulang OS", "Ganti Monitor"], correct: 1 },
    { title: "Kasus #2: No Signal", description: "Komputer menyala (kipas berputar), tetapi layar monitor tetap hitam (No Signal).", options: ["Install ulang Windows", "Cek kabel VGA/HDMI & bersihkan RAM", "Ganti Power Supply", "Ganti Hardisk"], correct: 1 },
    { title: "Kasus #3: Bunyi Beep Panjang", description: "Muncul bunyi 'Beep' panjang berulang kali saat PC baru dinyalakan.", options: ["Keyboard rusak", "Processor overheat", "Masalah pada RAM", "BIOS korup"], correct: 2 },
    { title: "Kasus #4: Network Silang Merah", description: "Indikator LAN Card menyala, tapi ikon jaringan di taskbar bertanda silang merah.", options: ["Kabel UTP putus/tidak pas", "Driver belum terpasang", "IP Address bentrok", "Firewall memblokir"], correct: 0 },
    { title: "Kasus #5: Boot Device Not Found", description: "Muncul pesan 'Reboot and Select Proper Boot Device' saat booting.", options: ["RAM longgar", "Kabel data Hardisk lepas", "Monitor rusak", "Pasta Processor kering"], correct: 1 },
    { title: "Kasus #6: Internet Lambat", description: "Kecepatan internet sangat lambat hanya pada satu komputer di lab.", options: ["Server ISP mati", "Router pusat rusak", "Cek kabel UTP & scan virus", "Switch terbakar"], correct: 2 },
    { title: "Kasus #7: Print Pending", description: "Printer terdeteksi, tetapi dokumen tidak mau tercetak (Status: Pending).", options: ["Ganti Cartridge", "Restart Print Spooler", "Install driver chipset", "Hapus aplikasi Word"], correct: 1 },
    { title: "Kasus #8: Request Timed Out (RTO)", description: "PC tidak bisa 'Ping' ke Google, padahal koneksi lokal lancar.", options: ["Salah Subnet Mask", "Gateway belum diisi", "Kabel LAN terlalu panjang", "Port switch penuh"], correct: 1 },
    { title: "Kasus #9: PC Sering Restart", description: "Komputer tiba-tiba mati/restart saat menjalankan aplikasi berat.", options: ["PSU lemah atau Overheat", "Mouse rusak", "Windows minta update", "Speaker konslet"], correct: 0 },
    { title: "Kasus #10: Keyboard BIOS", description: "Keyboard tidak berfungsi saat ingin masuk ke pengaturan BIOS.", options: ["Windows rusak", "Baterai CMOS habis", "Cek port USB/PS2", "Update driver"], correct: 2 }
];

let currentCaseIndex = 0;
let score = 0;
let lives = 3;
let timerInterval;
let timeLeft = 15;

document.addEventListener('DOMContentLoaded', () => {
    initThemeSync();
    loadCase();
});

// Fix: Logika Sinkronisasi Tema Tanpa Error
function initThemeSync() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const applyTheme = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            body.classList.remove('dark-mode');
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    };

    applyTheme(localStorage.getItem('theme') === 'dark');

    themeToggle?.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark);
    });
}

function loadCase() {
    if (lives <= 0) return;
    clearInterval(timerInterval);
    timeLeft = 15;
    updateTimerDisplay();
    startTimer();

    const c = cases[currentCaseIndex];
    document.getElementById('case-title').innerText = c.title;
    document.getElementById('case-description').innerText = c.description;
    
    const container = document.getElementById('option-container');
    container.innerHTML = '';
    
    c.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(idx);
        container.appendChild(btn);
    });

    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            lives--;
            showFeedback(false, "Waktu Habis! Teknisi harus sigap.");
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timer-text');
    if (timerEl) {
        timerEl.innerText = `⏳ Waktu: ${timeLeft}s`;
        timerEl.style.color = timeLeft <= 5 ? "#e74c3c" : "inherit";
    }
}

function checkAnswer(selectedIdx) {
    clearInterval(timerInterval);
    const correct = cases[currentCaseIndex].correct;
    if (selectedIdx === correct) {
        score += 10;
        showFeedback(true, "Benar! Diagnosamu tepat.");
    } else {
        lives--;
        showFeedback(false, "Salah! Langkah itu bisa merusak komponen.");
    }
}

function showFeedback(isCorrect, message) {
    const feedback = document.getElementById('feedback');
    const text = document.getElementById('feedback-text');
    text.innerText = message;
    feedback.style.display = 'block';
    feedback.style.backgroundColor = isCorrect ? "rgba(39, 174, 96, 0.1)" : "rgba(231, 76, 60, 0.1)";
    feedback.style.color = isCorrect ? "#27ae60" : "#e74c3c";
    
    document.getElementById('current-score').innerText = score;
    document.getElementById('lives').innerText = lives;

    if (lives <= 0) {
        setTimeout(() => {
            alert("GAME OVER! Skor Akhir: " + score);
            location.reload();
        }, 500);
    } else {
        document.getElementById('next-btn').style.display = 'inline-block';
    }
}

function nextCase() {
    currentCaseIndex++;
    if (currentCaseIndex < cases.length) {
        loadCase();
    } else {
        alert("HEBAT! Kamu Teknisi AcademiGo Sejati. Skor: " + score);
        location.reload();
    }
}