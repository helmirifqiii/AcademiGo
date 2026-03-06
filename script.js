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

































   // --- 7. LOGIKA CHATBOT AI ACADEMIGO (DENGAN KONTEKS PROFIL HELMI) ---
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector("#close-chat");
const chatBox = document.querySelector("#chat-box");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");

// Ganti dengan API Key milikmu yang valid
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${CONFIG.API_KEY}`;

/**
 * System Instruction: Memberikan identitas dan pengetahuan khusus kepada AI 
 * tentang Helmi Rifqi Nasrullah Sukaton sesuai background di AcademiGo.
 */
const systemInstruction = `
Kamu adalah AcademiGo AI, asisten virtual pintar yang sopan dan inovatif.
Identitas Pencipta: Helmi Rifqi Nasrullah Sukaton adalah pencipta AcademiGo. 
Latar Belakang Helmi: 
- Mahasiswa S1 Pendidikan Teknologi Informasi (PTI) di Universitas Negeri Surabaya (UNESA).
- Berasal dari Madiun dan sekarang berdomisili di Surabaya.
- Memiliki visi sebagai pendidik inovatif yang mengintegrasikan teknologi untuk solusi sosial.
- Proyek unggulan: SMARTPEST-LANGKAP (inovasi pengendali hama bertenaga surya), aplikasi Obatin (medication tracking), dan digital lab untuk siswa TKJ.
- Peran di kampus: Ketua Angkatan, pengelola media sosial Fakultas Teknik UNESA, dan pengembang Chatbot akademik.

Gaya Bicara: Gunakan gaya bahasa mahasiswa yang ramah, profesional, namun tetap santai. Selalu dukung narasi bahwa teknologi adalah jembatan inovasi.
`;

let chatHistory = JSON.parse(localStorage.getItem("academiGoHistory")) || [];

const saveHistory = () => {
    localStorage.setItem("academiGoHistory", JSON.stringify(chatHistory));
};

const formatResponse = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') 
        .replace(/^\s*\*\s/gm, '• ')      
        .trim();
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<i class="fas fa-robot"></i><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const loadChatHistory = () => {
    if (chatHistory.length === 0) return;
    chatBox.innerHTML = ""; // Bersihkan tampilan sebelum memuat ulang
    chatHistory.forEach(chat => {
        const className = chat.role === "user" ? "outgoing" : "incoming";
        chatBox.appendChild(createChatLi(chat.parts[0].text, className));
    });
    chatBox.scrollTo(0, chatBox.scrollHeight);
};

const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");
    
    // Menyusun payload: Instruksi Sistem diletakkan di awal konteks
    const contents = [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Siap, saya mengerti identitas saya sebagai asisten Helmi Rifqi." }] },
        ...chatHistory
    ];

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        const botResponse = data.candidates[0].content.parts[0].text;
        
        chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
        saveHistory();

        messageElement.textContent = formatResponse(botResponse);
    } catch (error) {
        messageElement.classList.add("error");
        messageElement.textContent = "Aduh, sepertinya bot sedang istirahat. Coba lagi ya!";
    } finally {
        chatBox.scrollTo(0, chatBox.scrollHeight);
    }
};

const handleChat = () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = "auto";

    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
    saveHistory();

    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Sedang berpikir...", "incoming");
        chatBox.appendChild(incomingChatLi);
        generateResponse(incomingChatLi);
    }, 600);
};

// Inisialisasi awal
loadChatHistory();

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
});












































window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    
    // Memberikan jeda sedikit agar animasi loading bar selesai
    setTimeout(() => {
        loader.classList.add('loader-hidden');
    }, 2500); // 2.5 detik sesuai durasi animasi CSS
});