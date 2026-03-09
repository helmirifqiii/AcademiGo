const toolboxItems = document.querySelectorAll('.device-item');
const canvas = document.getElementById('canvas-area');
const statusMsg = document.getElementById('status-message');

let deviceCount = 0;

// Drag dari toolbox
toolboxItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('deviceType', e.target.dataset.type);
        e.dataTransfer.setData('icon', e.target.querySelector('.icon').innerText);
    });
});

// Drop ke kanvas
canvas.addEventListener('dragover', (e) => e.preventDefault());

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 40; // Menyesuaikan titik tengah perangkat
    const y = e.clientY - rect.top - 40;

    const type = e.dataTransfer.getData('deviceType');
    const icon = e.dataTransfer.getData('icon');

    if (type) {
        createDeviceOnCanvas(type, icon, x, y);
    }
});

function createDeviceOnCanvas(type, icon, x, y) {
    deviceCount++;
    const device = document.createElement('div');
    device.className = 'dropped-device';
    device.style.left = `${x}px`;
    device.style.top = `${y}px`;
    device.innerHTML = `<div>${icon}</div><div style="font-size: 10px;">${type} ${deviceCount}</div>`;
    
    // Menghilangkan teks petunjuk jika sudah ada perangkat
    const hint = document.querySelector('.canvas-hint');
    if (hint) hint.style.display = 'none';

    canvas.appendChild(device);
    makeDraggable(device);
}

// Logika agar perangkat yang sudah di drop bisa digeser lagi
function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function resetCanvas() {
    const devices = document.querySelectorAll('.dropped-device');
    devices.forEach(d => d.remove());
    deviceCount = 0;
    document.querySelector('.canvas-hint').style.display = 'block';
}

function checkTopology() {
    const total = document.querySelectorAll('.dropped-device').length;
    if (total < 2) {
        alert("Tambahkan minimal 2 perangkat untuk membentuk jaringan!");
    } else {
        alert("Topologi terekam. Langkah selanjutnya: Hubungkan dengan kabel Straight/Cross!");
    }
}