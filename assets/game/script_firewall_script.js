const cmdInput = document.getElementById('cmd-input');
const output = document.getElementById('terminal-output');
const log = document.getElementById('traffic-log');
const missionText = document.getElementById('mission-text');

let blockedIPs = [];
let gameMode = "TUTORIAL"; // Mode awal adalah Tutorial
let tutorialStep = 1;
let targetIP = "10.0.0.5";

// Tampilan awal Tutorial
printOutput("SYSTEM: Memasuki MODE TUTORIAL.");
printOutput("Tugas 1: Ketik 'help' untuk melihat daftar perintah.");

cmdInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const val = this.value.trim().toLowerCase();
        const args = val.split(' ');
        const cmd = args[0];
        const ipArg = args[1];

        printOutput(`firewall@admin:# ${this.value}`);

        if (gameMode === "TUTORIAL") {
            handleTutorial(cmd, ipArg);
        } else {
            handleFinalCase(cmd, ipArg);
        }
        
        this.value = '';
        output.scrollTop = output.scrollHeight;
    }
});

// --- LOGIKA TUTORIAL ---
function handleTutorial(cmd, ipArg) {
    if (tutorialStep === 1 && cmd === 'help') {
        printOutput("Bagus! help digunakan untuk bantuan.");
        printOutput("Tugas 2: Sekarang coba blokir IP dummy dengan mengetik: block 1.1.1.1");
        tutorialStep = 2;
    } 
    else if (tutorialStep === 2 && cmd === 'block' && ipArg === '1.1.1.1') {
        printOutput("Sempurna! Kamu sudah mengerti cara memblokir.");
        printOutput("------------------------------------------------");
        printOutput("PERINGATAN: Deteksi serangan nyata dimulai!");
        gameMode = "FINAL_CASE";
        startTrafficSimulation();
    } else {
        printOutput("Gunakan perintah yang diminta di atas!");
    }
}

// --- LOGIKA KASUS AKHIR ---
function handleFinalCase(cmd, ipArg) {
    if (cmd === 'block' && ipArg === targetIP) {
        blockedIPs.push(ipArg);
        printOutput(`[SUCCESS] IP ${ipArg} Berhasil diblokir secara permanen!`);
        missionText.innerHTML = "🎉 <b>KASUS SELESAI!</b> Kamu adalah Network Security Hero!";
    } else {
        printOutput("Error: IP penyerang masih aktif! Cek monitor sebelah kiri.");
    }
}

// Simulasi Log hanya jalan setelah tutorial selesai
function startTrafficSimulation() {
    missionText.innerHTML = `⚠️ <b>KASUS AKHIR:</b> Serangan dari IP <b>${targetIP}</b> terdeteksi! Segera blokir!`;
    setInterval(() => {
        const randomIP = `192.168.1.${Math.floor(Math.random() * 254)}`;
        const isTarget = Math.random() > 0.7;
        const ip = isTarget ? targetIP : randomIP;
        
        const div = document.createElement('div');
        div.className = isTarget ? 'log-entry danger-log' : 'log-entry';
        
        if (blockedIPs.includes(ip)) {
            div.innerHTML = `[BLOCKED] Packet from ${ip} - Rejected`;
            div.style.color = 'gray';
        } else {
            div.innerHTML = `[ALLOW] Connection from ${ip} - Port 80 open`;
        }
        log.prepend(div);
    }, 1000);
}

function printOutput(text) {
    const div = document.createElement('div');
    div.innerHTML = `> ${text}`;
    output.appendChild(div);
}