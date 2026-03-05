document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Logika Dark Mode Sinkron dengan LocalStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle?.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        if (isDark) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
});

function calculateSubnet() {
    const ip = document.getElementById('ip-addr').value.trim();
    const cidr = parseInt(document.getElementById('cidr').value);
    
    if (!validateIP(ip)) {
        alert("IP Address tidak valid!");
        return;
    }

    // Perhitungan Network & Broadcast
    const mask = (cidr === 0) ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
    const ipInt = ipToLong(ip);
    const networkInt = (ipInt & mask) >>> 0;
    const broadcastInt = (cidr === 32) ? networkInt : (networkInt | (~mask)) >>> 0;
    
    // Update Tampilan Hasil
    document.getElementById('res-mask').innerText = longToIp(mask);
    document.getElementById('res-net').innerText = longToIp(networkInt);
    document.getElementById('res-first').innerText = longToIp(networkInt + 1);
    document.getElementById('res-last').innerText = (cidr === 32) ? longToIp(broadcastInt) : longToIp(broadcastInt - 1);
    document.getElementById('res-broad').innerText = longToIp(broadcastInt);
    document.getElementById('res-total').innerText = (cidr >= 31) ? 0 : Math.pow(2, 32 - cidr) - 2;

    document.getElementById('result-area').style.display = 'block';
    document.getElementById('result-area').scrollIntoView({ behavior: 'smooth' });
}

function ipToLong(ip) {
    return ip.split('.').reduce((res, octet) => (res << 8) + parseInt(octet, 10), 0) >>> 0;
}

function longToIp(long) {
    return [(long >>> 24) & 0xff, (long >>> 16) & 0xff, (long >>> 8) & 0xff, long & 0xff].join('.');
}

function validateIP(ip) {
    const re = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return re.test(ip);
}