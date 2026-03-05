const input = document.getElementById('cmd-input');
const output = document.getElementById('output');
const browser = document.getElementById('browser-content');
const mission = document.getElementById('mission-text');

let isApacheInstalled = false;
let currentFileContent = "<h1>Selamat Datang di Web Server Baru!</h1><p>Server berhasil diinstal.</p>";

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const val = this.value.trim().toLowerCase();
        printLine(`<span class="prompt">#</span> ${this.value}`);
        
        handleCommand(val);
        this.value = '';
    }
});

function handleCommand(cmd) {
    if (cmd === 'apt install apache2') {
        printLine("Mengunduh paket...");
        setTimeout(() => {
            printLine("Instalasi Apache2 berhasil. Server berjalan di Port 80.");
            isApacheInstalled = true;
            updateBrowser();
            mission.innerHTML = "Bagus! Sekarang ketik <code>nano index.html</code> untuk mengubah konten website.";
        }, 1500);
    } 
    else if (cmd === 'nano index.html') {
        if (!isApacheInstalled) {
            printLine("Error: Web server belum diinstal!");
            return;
        }
        const newContent = prompt("Edit isi index.html (Masukkan kode HTML):", currentFileContent);
        if (newContent) {
            currentFileContent = newContent;
            printLine("File index.html berhasil diperbarui.");
            updateBrowser();
            mission.innerHTML = "🎉 <b>Misi Selesai!</b> Kamu telah berhasil mengonfigurasi Web Server.";
        }
    }
    else if (cmd === 'ls') {
        printLine(isApacheInstalled ? "index.html  apache2.conf" : "direktori kosong");
    }
    else if (cmd === 'help') {
        printLine("Perintah: apt install apache2, nano index.html, ls, help");
    }
    else {
        printLine(`Perintah '${cmd}' tidak ditemukan.`);
    }
}

function printLine(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    output.appendChild(div);
    document.getElementById('terminal-body').scrollTop = document.getElementById('terminal-body').scrollHeight;
}

function updateBrowser() {
    if (isApacheInstalled) {
        browser.innerHTML = currentFileContent;
    } else {
        browser.innerHTML = '<div class="placeholder-text">Server belum berjalan...</div>';
    }
}