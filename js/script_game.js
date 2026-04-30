const colorIDs = ['po', 'o', 'ph', 'b', 'pb', 'h', 'pc', 'c'];
const standarB = ['po', 'o', 'ph', 'b', 'pb', 'h', 'pc', 'c']; // Standar T568B
const standarA = ['ph', 'h', 'po', 'b', 'pb', 'o', 'pc', 'c']; // Standar T568A

let currentMode = 'T568B';

document.addEventListener('DOMContentLoaded', () => {
    initKabel();
    initThemeSync();
});

// --- Inisialisasi Tema (Dark/Light) ---
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

    themeToggle?.addEventListener('click', (e) => {
        e.preventDefault();
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark);
    });
}

// --- Acak Kabel ---
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Setup Awal Kabel ---
function initKabel() {
    const sumber = document.getElementById('kabel-sumber');
    if (!sumber) return;
    sumber.innerHTML = '';
    
    // Sediakan 16 kabel (2 set warna) agar cukup untuk dua ujung
    let kantongKabel = [...colorIDs, ...colorIDs];
    shuffle(kantongKabel).forEach(id => {
        const el = document.createElement('div');
        el.className = `kabel ${id}`;
        el.dataset.id = id;
        el.innerText = id.toUpperCase().replace('P', 'P/');
        sumber.appendChild(el);
    });

    if (typeof Sortable !== 'undefined') {
        const config = { group: 'cabling', animation: 150 };
        Sortable.create(sumber, config);
        Sortable.create(document.getElementById('target-1'), config);
        Sortable.create(document.getElementById('target-2'), config);
    }
}

// --- Pilih Mode: Straight atau Cross ---
function setMode(mode) {
    currentMode = mode;
    document.getElementById('mode-b')?.classList.toggle('active', mode === 'T568B');
    document.getElementById('mode-cross')?.classList.toggle('active', mode === 'Cross-Over');
    
    const labelU2 = document.getElementById('label-ujung-2');
    labelU2.innerText = `UJUNG 2 (${mode === 'T568B' ? 'T568B' : 'T568A'})`;
}

function resetGame() { location.reload(); }

// --- LOGIKA UTAMA TESTER ---
async function testCable() {
    const status = document.getElementById('tester-status');
    const u1 = Array.from(document.getElementById('target-1').children).map(el => el.dataset.id);
    const u2 = Array.from(document.getElementById('target-2').children).map(el => el.dataset.id);

    if (u1.length !== 8 || u2.length !== 8) {
        alert("Lengkapi 8 kabel di setiap ujung konektor!");
        return;
    }

    status.innerText = "Menguji Koneksi...";
    status.style.color = "inherit";

    // Mapping pin Remote yang harus nyala saat Master (1-8) nyala
    // Straight: 1->1, 2->2, 3->3, dst.
    // Cross: 1->3, 2->6, 3->1, 6->2, dst.
    const crossMap = { 0: 2, 1: 5, 2: 0, 3: 3, 4: 4, 5: 1, 6: 6, 7: 7 };
    
    let score = 0;

    for (let i = 0; i < 8; i++) {
        const lightM = document.getElementById(`m-${i + 1}`);
        lightM?.classList.add('on');

        // Tentukan di mana seharusnya lampu remote menyala secara fisik
        let targetRemoteIdx = (currentMode === 'T568B') ? i : crossMap[i];
        
        // Cek apakah kabel di Pin U1 ke-i sama dengan kabel di Pin U2 target
        // Dan pastikan kabel tersebut memang sesuai urutan standar (T568B)
        const isU1Correct = (u1[i] === standarB[i]);
        const targetWarnaU2 = (currentMode === 'T568B') ? standarB[i] : standarA[targetRemoteIdx];
        const isU2Correct = (u2[targetRemoteIdx] === targetWarnaU2);

        // Simulasi lampu Remote menyala jika "terhubung" (meskipun urutan salah, lampu tetap nyala kalau kabel nyambung)
        // Tapi di sini kita fokus pada validasi urutan benar
        const lightR = document.getElementById(`r-${targetRemoteIdx + 1}`);
        
        if (isU1Correct && isU2Correct) {
            lightR?.classList.add('on');
            score++;
        }

        await new Promise(r => setTimeout(r, 400));
        lightM?.classList.remove('on');
        lightR?.classList.remove('on');
    }

    const win = (score === 8);
    status.innerText = win ? "BERHASIL! Kabel Terpasang Sempurna." : "GAGAL! Cek kembali urutan kabel Anda.";
    status.style.color = win ? "#27ae60" : "#e74c3c";
}