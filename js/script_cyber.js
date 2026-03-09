const missions = [
    { id: 1, lvl: "Level 1: Dasar Firewall", title: "Akses Bantuan", desc: "Ketik 'help' untuk melihat daftar perintah.", materi: "Setiap firewall memiliki dokumentasi perintah dasar untuk administrator.", target: "help", type: "cmd" },
    { id: 2, lvl: "Level 1: Dasar Firewall", title: "Blokir Penyusup", desc: "IP 192.168.1.50 mencoba masuk tanpa izin. Blokir sekarang! (Gunakan: block [IP])", materi: "Perintah 'block [IP]' digunakan untuk memutus akses dari alamat tertentu.", target: "192.168.1.50", type: "block" },
    { id: 3, lvl: "Level 1: Dasar Firewall", title: "Analisis Log", desc: "Perhatikan monitor! Ada IP 10.0.0.1 yang mencurigakan. Blokir!", materi: "Administrator harus rajin memantau log untuk mendeteksi anomali trafik.", target: "10.0.0.1", type: "block" },
    { id: 4, lvl: "Level 1: Dasar Firewall", title: "Salah Blokir", desc: "IP 8.8.8.8 adalah DNS Google, jangan diblokir. Izinkan kembali! (Gunakan: allow [IP])", materi: "Gunakan 'allow [IP]' untuk membuka blokir yang salah dilakukan.", target: "8.8.8.8", type: "allow" },
    { id: 5, lvl: "Level 1: Dasar Firewall", title: "Kebersihan Layar", desc: "Terminal sudah penuh. Bersihkan layar! (Gunakan: clear)", materi: "Perintah 'clear' membantu menjaga fokus saat menangani insiden.", target: "clear", type: "cmd" },
    { id: 6, lvl: "Level 2: Keamanan Port", title: "SSH Brute Force", desc: "Tutup Port 22 untuk menghentikan serangan SSH. (Gunakan: block-port [Port])", materi: "Port 22 digunakan untuk remote access. Jika tidak dipakai, sebaiknya ditutup.", target: "22", type: "port" },
    { id: 7, lvl: "Level 2: Keamanan Port", title: "Insecure FTP", desc: "FTP (21) mengirim data tanpa enkripsi. Tutup portnya!", materi: "Protokol lama seperti FTP (21) berisiko tinggi terhadap penyadapan.", target: "21", type: "port" },
    { id: 8, lvl: "Level 2: Keamanan Port", title: "Targeted Block", desc: "Blokir IP 10.0.0.5 khusus pada Port 80. (Gunakan: block [IP] [Port])", materi: "Anda bisa memblokir IP pada port spesifik tanpa memutus koneksi lainnya.", target: "10.0.0.5 80", type: "ip-port" },
    { id: 9, lvl: "Level 2: Keamanan Port", title: "Telnet Attack", desc: "Serangan Telnet terdeteksi. Tutup Port 23!", materi: "Telnet mengirim password dalam bentuk teks biasa (plain text). Berbahaya!", target: "23", type: "port" },
    { id: 10, lvl: "Level 2: Keamanan Port", title: "Double Security", desc: "Blokir IP 5.5.5.5 dan Port 443 sekaligus.", materi: "Kombinasi blokir IP dan Port adalah standar keamanan perimeter.", target: "5.5.5.5 443", type: "ip-port" }
];

let currentLevel = 0;
const input = document.getElementById('cmd-input');
const output = document.getElementById('output');
const trafficLog = document.getElementById('traffic-log');

document.addEventListener('DOMContentLoaded', () => {
    initThemeSync();
    initGame();
});

function initThemeSync() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const applyTheme = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            themeIcon?.classList.replace('fa-moon', 'fa-sun');
        } else {
            body.classList.remove('dark-mode');
            themeIcon?.classList.replace('fa-sun', 'fa-moon');
        }
    };

    applyTheme(localStorage.getItem('theme') === 'dark');

    themeToggle?.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark);
    });
}

function initGame() {
    updateUI();
    startTraffic();
}

function focusInput() { input.focus(); }

function updateUI() {
    const m = missions[currentLevel];
    document.getElementById('level-title').innerText = m.lvl;
    document.getElementById('case-title').innerText = `Kasus #${m.id}: ${m.title}`;
    document.getElementById('case-desc').innerHTML = m.desc;
    document.getElementById('materi-text').innerHTML = `<b>📖 Materi:</b> ${m.materi}`;
    document.getElementById('progress').innerText = `${m.id}/10`;
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val === "") return;
        printLine(`<span style="color: #3465a4">admin@firewall:#</span> ${val}`);
        validateCommand(val);
        input.value = '';
    }
});

function validateCommand(val) {
    const lowerVal = val.toLowerCase();
    const args = lowerVal.split(' ');
    const m = missions[currentLevel];
    let success = false;

    if (m.type === "cmd" && lowerVal === m.target) success = true;
    if (m.type === "block" && args[0] === "block" && args[1] === m.target) success = true;
    if (m.type === "allow" && args[0] === "allow" && args[1] === m.target) success = true;
    if (m.type === "port" && args[0] === "block-port" && args[1] === m.target) success = true;
    if (m.type === "ip-port" && args[0] === "block" && `${args[1]} ${args[2]}` === m.target) success = true;

    if (success) {
        printLine("<span style='color:lime'>[SUCCESS] Konfigurasi diterapkan. Misi berhasil!</span>");
        currentLevel++;
        if (currentLevel < missions.length) {
            setTimeout(updateUI, 1000);
        } else {
            alert("👑 Selamat Mr. Helmi! Kamu lulus sebagai Cyber Security Expert AcademiGo!");
            location.reload();
        }
    } else if (lowerVal === "clear") {
        output.innerHTML = '';
    } else if (lowerVal === "help") {
        printLine("Perintah: <br> - help <br> - block [IP] <br> - allow [IP] <br> - block-port [PORT] <br> - block [IP] [PORT] <br> - clear");
    } else {
        printLine("<span style='color:red'>[ERROR] Konfigurasi ditolak. Cek perintah atau target!</span>");
    }
}

function printLine(text) {
    const div = document.createElement('div');
    div.style.marginBottom = "5px";
    div.innerHTML = `> ${text}`;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function startTraffic() {
    setInterval(() => {
        const ips = ["192.168.1.1", "10.0.0.1", "172.16.0.5", "8.8.8.8", "192.168.1.50"];
        const randomIP = ips[Math.floor(Math.random() * ips.length)];
        const isDanger = randomIP === "10.0.0.1" || randomIP === "192.168.1.50";
        
        const entry = document.createElement('div');
        entry.className = isDanger ? "log-entry danger-log" : "log-entry";
        entry.innerText = `[INFO] Packet from ${randomIP} - ${isDanger ? 'SUSPICIOUS' : 'OK'}`;
        
        trafficLog.prepend(entry);
        if (trafficLog.children.length > 20) trafficLog.lastChild.remove();
    }, 1500);
}