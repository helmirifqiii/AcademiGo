// --- KONFIGURASI ---
const MODEL_URL = './models'; // Pastikan path ini benar menuju folder model
const launcher = document.getElementById('kibo-launcher');
const kiboWindow = document.getElementById('kibo-window');
const closeKibo = document.getElementById('close-kibo');
const video = document.getElementById('webcam');
const videoWrapper = document.getElementById('video-wrapper');
const visionIcon = document.getElementById('vision-icon');
const btnVision = document.getElementById('btn-vision');
const currentMoodSpan = document.getElementById('current-mood');
const statusSpan = document.getElementById('kibo-status');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const btnSend = document.getElementById('btn-send');

let isVisionActive = false;
let userMood = 'netral';
let visionInterval;

// --- 1. TOGLE WINDOW CHAT ---
launcher.addEventListener('click', () => {
    const isHidden = kiboWindow.style.display === 'none';
    kiboWindow.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) userInput.focus();
});

closeKibo.addEventListener('click', () => {
    kiboWindow.style.display = 'none';
    if (isVisionActive) stopVision();
});

// --- 2. LOAD MODELS (TINY DETECTOR & EXPRESSIONS) ---
async function initKibo() {
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        statusSpan.innerText = "Online";
        statusSpan.style.color = "#22c55e";
    } catch (err) {
        console.error("Gagal load model:", err);
        statusSpan.innerText = "Offline";
    }
}
initKibo();

// --- 3. VISION CONTROL ---
btnVision.addEventListener('click', async () => {
    if (isVisionActive) {
        stopVision();
    } else {
        await startVision();
    }
});

async function startVision() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        isVisionActive = true;
        videoWrapper.style.display = 'block';
        visionIcon.classList.replace('fa-eye-slash', 'fa-eye');
        btnVision.classList.add('vision-active');
        
        visionInterval = setInterval(async () => {
            const detections = await faceapi.detectSingleFace(video, 
                new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
            
            if (detections) {
                const sorted = detections.expressions.asSortedArray()[0];
                userMood = sorted.expression;
                currentMoodSpan.innerText = userMood.toUpperCase();
            }
        }, 1000);
    } catch (err) {
        alert("Kibo butuh izin kamera untuk Vision.");
    }
}

function stopVision() {
    const stream = video.srcObject;
    if (stream) stream.getTracks().forEach(t => t.stop());
    isVisionActive = false;
    videoWrapper.style.display = 'none';
    visionIcon.classList.replace('fa-eye', 'fa-eye-slash');
    btnVision.classList.remove('vision-active');
    clearInterval(visionInterval);
}

// --- 4. CHAT LOGIC ---
function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user-msg');
    userInput.value = '';

    // Simulasi loading
    statusSpan.innerText = "Kibo Mengetik...";
    setTimeout(() => {
        const response = generateKiboResponse(text, userMood);
        addMessage(response, 'kibo-msg');
        statusSpan.innerText = isVisionActive ? "Vision Active" : "Online";
    }, 1200);
}

btnSend.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });

function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- 5. EMPATHETIC RESPONSE (Logika Dasar) ---
function generateKiboResponse(text, mood) {
    // Di sini nanti integrasikan dengan API Gemini kamu
    if (mood === 'sad' || mood === 'fearful') {
        return "Kibo merasa kamu sedang tidak baik-baik saja. Ceritakan saja, Kibo di sini untukmu...";
    } else if (mood === 'happy') {
        return "Wah, sepertinya kamu sedang senang! Kibo ikut senang mendengarnya. Ada cerita seru?";
    } else if (mood === 'angry') {
        return "Kibo melihat kamu sedang kesal. Tarik napas dulu pelan-pelan, Kibo siap dengerin keluhanmu.";
    }
    return "Kibo dengerin kok, lanjutin ceritanya ya...";
}