const input = document.getElementById('command-input');
const output = document.getElementById('output');
const missionText = document.getElementById('mission-text');

// Sistem File Virtual
let fileSystem = {
    'home': {
        'admin': {}
    }
};
let currentPath = ['home', 'admin'];

const missions = [
    { text: "Buatlah folder bernama <b>'Data_Siswa'</b> di direktori home!", check: () => fileSystem.home.admin.hasOwnProperty('Data_Siswa') },
    { text: "Hapus folder <b>'Data_Siswa'</b> yang baru saja dibuat!", check: () => !fileSystem.home.admin.hasOwnProperty('Data_Siswa') }
];
let currentMissionIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    initThemeSync();
});

// Fix: Logika Sinkronisasi Tema
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

function focusInput() {
    input.focus();
}

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const fullCommand = this.value.trim();
        if (fullCommand === "") return;

        const args = fullCommand.split(' ').filter(arg => arg !== "");
        const cmd = args[0].toLowerCase();

        printLine(`<span class="prompt">admin@academi-go:~$</span> ${fullCommand}`);
        handleCommand(cmd, args.slice(1));
        
        this.value = '';
        checkMission();
        scrollToBottom();
    }
});

function handleCommand(cmd, args) {
    switch(cmd) {
        case 'help':
            printLine("Perintah tersedia: <span style='color: #3465a4;'>ls, mkdir, rmdir, clear, help</span>");
            break;
        case 'ls':
            let dir = getDir(currentPath);
            let files = Object.keys(dir);
            printLine(files.length > 0 ? files.join('  ') : "(direktori kosong)");
            break;
        case 'mkdir':
            if (args[0]) {
                let currentDir = getDir(currentPath);
                currentDir[args[0]] = {};
                printLine(`✔ Direktori '${args[0]}' berhasil dibuat.`);
            } else {
                printLine("<span style='color: #ff5f56;'>Galat:</span> Masukkan nama folder. Contoh: mkdir folder_baru");
            }
            break;
        case 'rmdir':
            if (args[0]) {
                let currentDir = getDir(currentPath);
                if (currentDir.hasOwnProperty(args[0])) {
                    delete currentDir[args[0]];
                    printLine(`✔ Direktori '${args[0]}' telah dihapus.`);
                } else {
                    printLine(`<span style='color: #ff5f56;'>Galat:</span> Folder '${args[0]}' tidak ditemukan.`);
                }
            } else {
                printLine("<span style='color: #ff5f56;'>Galat:</span> Gunakan rmdir [nama_folder]");
            }
            break;
        case 'clear':
            output.innerHTML = '';
            break;
        default:
            printLine(`Command '${cmd}' tidak dikenal. Ketik 'help' untuk bantuan.`);
    }
}

function getDir(path) {
    return path.reduce((acc, part) => acc[part], fileSystem);
}

function printLine(text) {
    const div = document.createElement('div');
    div.className = 'line';
    div.innerHTML = text;
    output.appendChild(div);
}

function checkMission() {
    if (currentMissionIndex < missions.length && missions[currentMissionIndex].check()) {
        printLine("<br><span style='color: #27c93f; font-weight: bold;'>🎉 TANTANGAN BERHASIL!</span>");
        currentMissionIndex++;
        if (currentMissionIndex < missions.length) {
            missionText.innerHTML = missions[currentMissionIndex].text;
        } else {
            missionText.innerHTML = "✨ <b>Selamat!</b> Semua tantangan Linux dasar telah selesai.";
        }
    }
}

function scrollToBottom() {
    const body = document.getElementById('terminal-body');
    body.scrollTop = body.scrollHeight;
}