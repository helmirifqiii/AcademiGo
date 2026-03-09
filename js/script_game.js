const colorIDs = ['po', 'o', 'ph', 'b', 'pb', 'h', 'pc', 'c'];
const standarB = ['po', 'o', 'ph', 'b', 'pb', 'h', 'pc', 'c'];
const standarA = ['ph', 'h', 'po', 'b', 'pb', 'o', 'pc', 'c'];
let currentMode = 'T568B';

document.addEventListener('DOMContentLoaded', () => {
    initKabel();
    initThemeSync();
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

    themeToggle?.addEventListener('click', (e) => {
        e.preventDefault();
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initKabel() {
    const sumber = document.getElementById('kabel-sumber');
    if (!sumber) return;
    sumber.innerHTML = '';
    
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

function setMode(mode) {
    currentMode = mode;
    document.getElementById('mode-b')?.classList.toggle('active', mode === 'T568B');
    document.getElementById('mode-cross')?.classList.toggle('active', mode === 'Cross-Over');
    document.getElementById('label-ujung-2').innerText = `UJUNG 2 (${mode === 'T568B' ? 'T568B' : 'T568A'})`;
}

function resetGame() { location.reload(); }

async function testCable() {
    const targetU2 = (currentMode === 'T568B') ? standarB : standarA;
    const status = document.getElementById('tester-status');
    const u1 = Array.from(document.getElementById('target-1').children).map(el => el.dataset.id);
    const u2 = Array.from(document.getElementById('target-2').children).map(el => el.dataset.id);

    if (u1.length !== 8 || u2.length !== 8) {
        alert("Lengkapi 8 kabel di setiap ujung konektor!");
        return;
    }

    
    status.innerText = "Menguji Koneksi...";
    for (let i = 1; i <= 8; i++) {
        const lightM = document.getElementById(`m-${i}`);
        const lightR = document.getElementById(`r-${i}`);
        lightM?.classList.add('on');
        if (u1[i-1] === standarB[i-1] && u2[i-1] === targetU2[i-1]) {
            lightR?.classList.add('on');
        }
        await new Promise(r => setTimeout(r, 450));
        lightM?.classList.remove('on');
        lightR?.classList.remove('on');
    }

    const win = JSON.stringify(u1) === JSON.stringify(standarB) && JSON.stringify(u2) === JSON.stringify(targetU2);
    status.innerText = win ? "BERHASIL! Kabel Terpasang Sempurna." : "GAGAL! Cek kembali urutan kabel Anda.";
    status.style.color = win ? "#27ae60" : "#e74c3c";
}