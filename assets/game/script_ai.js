// Database Jawaban Cerdas Sederhana (Simulasi AI)
const aiKnowledge = {
    "chmod": "Perintah 'chmod' digunakan untuk mengubah hak akses file atau direktori di Linux. Contoh: 'chmod 777 nama_file'.",
    "ip": "IP Address adalah identitas perangkat dalam jaringan komputer, mirip seperti nomor rumah.",
    "ping": "Perintah 'ping' digunakan untuk mengecek apakah perangkat tujuan terhubung dalam jaringan atau tidak.",
    "lan": "LAN Tester digunakan untuk menguji apakah urutan kabel UTP (Straight/Cross) sudah benar."
};

function toggleChat() {
    const chatBox = document.getElementById('chat-box');
    chatBox.classList.toggle('chat-hidden');
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;

    appendMessage(input.value, 'user-msg');
    input.value = '';

    // Simulasi Berpikir AI
    setTimeout(() => {
        let response = "Maaf Mr., saya tidak menemukan informasi spesifik tentang itu. Bisa coba tanyakan tentang 'chmod', 'IP', atau 'Ping'?";
        
        for (let key in aiKnowledge) {
            if (msg.includes(key)) {
                response = aiKnowledge[key];
                break;
            }
        }
        appendMessage(response, 'bot-msg');
    }, 800);
}

function appendMessage(text, className) {
    const content = document.getElementById('chat-content');
    const msgDiv = document.createElement('div');
    msgDiv.className = className;
    msgDiv.innerText = text;
    content.appendChild(msgDiv);
    content.scrollTop = content.scrollHeight;
}