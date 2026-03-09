document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELEKSI ELEMEN ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const searchTrigger = document.getElementById('search-trigger');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const body = document.body;

    // --- 2. LOGIKA DARK MODE ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if(themeIcon) {
                isDark ? themeIcon.classList.replace('fa-moon', 'fa-sun') 
                       : themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // --- 3. MOBILE MENU (DROPDOWN) ---
    if(menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        // Mencegah dropdown tertutup saat area menu di dalam diklik
        dropdownMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    document.addEventListener('click', () => {
        if(dropdownMenu) dropdownMenu.classList.remove('active');
    });

    // --- 4. ANIMASI SCROLL (INTERSECTION OBSERVER) ---
    // Menambahkan .module-card dan .project-card agar ikut beranimasi
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // Selektor gabungan untuk semua elemen di semua halaman
    const animatedElements = document.querySelectorAll('.cv-card, .skill-item, .dashboard-card, .module-card, .project-card, .info-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease-out";
        observer.observe(el);
    });

    // --- 5. SEARCH OVERLAY ---
    if(searchTrigger && searchOverlay) {
        searchTrigger.addEventListener('click', () => {
            searchOverlay.style.display = 'flex';
            document.getElementById('search-input').focus();
        });
    }

    if(searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.style.display = 'none';
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay) {
            searchOverlay.style.display = 'none';
        }
    });

    // --- 6. LOGIKA FORM KONTAK ---
    const contactForm = document.querySelector('.contact-form-wrapper form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            const btnSend = this.querySelector('.btn-send');
            if(btnSend) {
                const btnText = btnSend.querySelector('span');
                const btnIcon = btnSend.querySelector('i');

                btnSend.style.pointerEvents = 'none';
                btnSend.style.opacity = '0.7';
                if(btnText) btnText.innerText = 'Mengirim...';
                if(btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';
            }
        });
    }

































    // --- 7. LOGIKA LENGKAP CHATBOT KIBO ---
const API_KEY = "AIzaSyDkcfTQ22JVNR4jkw4PQrw1vmLXTGySNKo";

// Fungsi untuk menampilkan pesan ke UI
function appendMessage(text, className) {
    const chatOutput = document.getElementById('chat-output');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${className}`;
    msgDiv.innerText = text;
    if (chatOutput) {
        chatOutput.appendChild(msgDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
    return msgDiv;
}

// Fungsi Toggle Jendela Chat
window.toggleChat = function() {
    const chatWin = document.getElementById('chat-window');
    if (chatWin) {
        // Cek display saat ini, jika flex maka sembunyikan, jika tidak maka tampilkan
        const isFlex = chatWin.style.display === 'flex';
        chatWin.style.display = isFlex ? 'none' : 'flex';
    }
};

// Fungsi deteksi tombol Enter
window.handleKeyPress = function(e) {
    if (e.key === 'Enter') window.sendMessage();
};

// Fungsi Utama Kirim Pesan ke Gemini API
window.sendMessage = async function() {
    const inputField = document.getElementById('user-input');
    const message = inputField.value.trim();
    
    // Validasi input kosong
    if (!message) return;

    // 1. Tampilkan pesan user di chat
    appendMessage(message, 'user-msg');
    inputField.value = '';

    // 2. Tampilkan status loading
    const loadingMsg = appendMessage('Kibo sedang berpikir...', 'kibo-msg');

    try {
        // Memanggil Google Gemini API 1.5 Flash (Versi stabil)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `Nama kamu adalah Kibo, asisten AI untuk website AcademiGo.
                        
                        ATURAN JAWABAN:
                        1. Gunakan format yang SANGAT RAPI. Gunakan Bullet points (•) untuk daftar.
                        2. Gunakan Bold (**) untuk kata kunci penting.
                        3. Jangan memberi jawaban terlalu panjang, langsung ke inti.
                        4. Jika ditanya siapa Helmi Rifqi Nasrullah Sukaton, jawab: 
                           "Dia adalah **pencipta AcademiGo**. Helmi adalah mahasiswa **Pendidikan Teknologi Informasi UNESA** yang berdedikasi membangun solusi digital inovatif seperti **SMARTPEST-LANGKAP** (inovasi pembasmi hama tenaga surya) dan berbagai proyek laboratorium virtual untuk pendidikan."

                        Pertanyaan user: ${message}` 
                    }] 
                }]
            })
        });

        // 3. Penanganan Limit API (Error 429)
        if (response.status === 429) {
            loadingMsg.innerText = "yahhhh maaf kibo sedang istirahat coba lagi besok yah best!! Love you!!";
            return;
        }

        const data = await response.json();
        
        // 4. Tampilkan jawaban dari AI
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const botResponse = data.candidates[0].content.parts[0].text;
            loadingMsg.remove(); // Hapus tulisan loading
            appendMessage(botResponse, 'kibo-msg');
        } else {
            throw new Error("Respons tidak valid");
        }
        
    } catch (error) {
        // 5. Penanganan error umum atau koneksi terputus
        loadingMsg.innerText = "yahhhh maaf kibo sedang istirahat coba lagi besok yah best!! Love you!!";
        console.error("Chatbot Error:", error);
    }
};

































window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('bar');
    
    let width = 0;
    // Simulasi loading progress bar
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            // Hilangkan loading screen setelah 100%
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
            }, 500);
        } else {
            width += 5; // Kecepatan loading
            progressBar.style.width = width + '%';
        }
    }, 100);
});
});