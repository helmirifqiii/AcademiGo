const toolData = {
    'crimping': {
        name: "Tang Crimping",
        desc: "Alat multifungsi yang digunakan untuk memotong kabel, mengupas kulit kabel UTP, dan menjepit (press) konektor RJ45 agar pin tembaga menyentuh inti kabel.",
        tip: "Pastikan terdengar bunyi 'klik' saat menjepit RJ45 agar koneksi tidak longgar."
    },
    'lan-tester': {
        name: "LAN Tester",
        desc: "Alat penguji untuk memastikan setiap urutan pin terhubung dengan benar dan data dapat mengalir sempurna.",
        tip: "Lampu 1-8 harus menyala berurutan pada Master dan Remote untuk standar Straight."
    },
    'rj45': {
        name: "Konektor RJ45",
        desc: "Interface fisik yang menghubungkan kabel dengan port LAN perangkat. Memiliki 8 pin tembaga di dalamnya.",
        tip: "Selalu dorong kabel hingga inti tembaga menyentuh ujung depan konektor sebelum di-press."
    },
    'utp': {
        name: "Kabel UTP",
        desc: "Unshielded Twisted Pair. Kabel media transmisi data yang berisi 4 pasang kawat tembaga berpilin.",
        tip: "Jangan mengupas kulit kabel terlalu panjang agar lilitan kabel tetap terjaga hingga ke dekat pin."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Sync Dark Mode dari localStorage (Sama dengan script_game.js)
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const applyTheme = (isDark) => {
        body.classList.toggle('dark-mode', isDark);
        themeIcon?.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
    };

    applyTheme(localStorage.getItem('theme') === 'dark');

    themeToggle?.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark);
    });

    // Interaction Alat
    const cards = document.querySelectorAll('.tool-card');
    const infoContent = document.getElementById('info-content');
    const placeholder = document.querySelector('.info-placeholder');

    cards.forEach(card => {
        const showInfo = () => {
            const data = toolData[card.dataset.tool];
            placeholder.classList.add('hidden');
            infoContent.classList.remove('hidden');
            document.getElementById('tool-name').innerText = data.name;
            document.getElementById('tool-desc').innerText = data.desc;
            document.getElementById('tool-tip').innerText = data.tip;
        };
        card.addEventListener('mouseenter', showInfo);
        card.addEventListener('click', showInfo);
    });
});