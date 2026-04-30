const labels = {
    pc1: "Laptop A",
    pc2: "Laptop B"
};

const guideSteps = [
    "Buka laptop yang dipilih. Pastikan laptop sudah terhubung ke switch menggunakan kabel LAN.",
    "Tekan tombol Windows + R. Pada simulasi ini, klik ikon Win + R di layar laptop.",
    "Di jendela Run, ketik ncpa.cpl dengan tepat.",
    "Tekan Enter atau klik OK. Jendela Network Connections akan terbuka.",
    "Cari ikon Ethernet atau Local Area Connection. Jika ada tanda silang merah, kabel LAN belum terpasang.",
    "Klik kanan Ethernet, lalu pilih Properties.",
    "Cari Internet Protocol Version 4 (TCP/IPv4), klik satu kali agar tersorot.",
    "Klik tombol Properties untuk membuka pengaturan IPv4.",
    "Pilih Use the following IP address agar kotak IP bisa diisi manual.",
    "Isi IP Address bebas. Untuk ping berhasil, gunakan network yang sama dengan laptop lawan dan angka host yang berbeda.",
    "Isi Subnet Mask. Contoh yang sering dipakai untuk praktik dasar adalah 255.255.255.0.",
    "Default gateway dan DNS boleh dikosongkan untuk praktik dua laptop satu switch.",
    "Klik OK lalu Close. Pengaturan IP laptop ini selesai.",
    "Untuk mematikan firewall, tekan Windows + R lalu ketik control firewall.cpl.",
    "Klik Turn Windows Defender Firewall on or off di menu sebelah kiri.",
    "Pilih Turn off Windows Defender Firewall pada Private network dan Public network, lalu klik OK.",
    "Ulangi langkah pada laptop satunya, kemudian uji koneksi lewat Command Prompt."
];

const state = {
    selectedPc: "pc1",
    currentStep: 0,
    activeWindowPc: "pc1",
    activeTerminalPc: "pc1",
    pc1: { ip: "", subnet: "", firewallOff: false, ipv4Opened: false },
    pc2: { ip: "", subnet: "", firewallOff: false, ipv4Opened: false },
    cable: { pc1: true, pc2: true },
    pingSuccess: false,
    terminalOutput: {
        pc1: "",
        pc2: ""
    }
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
    bindElements();
    bindEvents();
    restoreTheme();
    renderAll();
});

function bindElements() {
    els.body = document.body;
    els.themeToggle = document.getElementById("themeToggle");
    els.deviceTabs = document.querySelectorAll(".device-tab");
    els.guideTitle = document.getElementById("guideTitle");
    els.guideStep = document.getElementById("guideStep");
    els.guideText = document.getElementById("guideText");
    els.prevStep = document.getElementById("prevStep");
    els.nextStep = document.getElementById("nextStep");
    els.pc1Cable = document.getElementById("pc1Cable");
    els.pc2Cable = document.getElementById("pc2Cable");
    els.cableLeft = document.getElementById("cableLeft");
    els.cableRight = document.getElementById("cableRight");
    els.port1 = document.getElementById("port1");
    els.port2 = document.getElementById("port2");
    els.pc1Info = document.getElementById("pc1Info");
    els.pc2Info = document.getElementById("pc2Info");
    els.networkStatus = document.getElementById("networkStatus");
    els.windowsPanel = document.getElementById("windowsPanel");
    els.windowTitle = document.getElementById("windowTitle");
    els.windowBody = document.getElementById("windowBody");
    els.closeWindow = document.getElementById("closeWindow");
    els.openRunButtons = document.querySelectorAll(".open-run");
    els.openAppButtons = document.querySelectorAll(".open-app");
    els.steps = {
        cable: document.getElementById("stepCable"),
        ipA: document.getElementById("stepIpA"),
        ipB: document.getElementById("stepIpB"),
        firewall: document.getElementById("stepFirewall"),
        ping: document.getElementById("stepPing")
    };
}

function bindEvents() {
    els.themeToggle.addEventListener("click", toggleTheme);

    els.deviceTabs.forEach((tab) => {
        tab.addEventListener("click", () => selectPc(tab.dataset.pc));
    });

    els.prevStep.addEventListener("click", () => {
        state.currentStep = Math.max(0, state.currentStep - 1);
        renderGuide();
    });

    els.nextStep.addEventListener("click", () => {
        state.currentStep = Math.min(guideSteps.length - 1, state.currentStep + 1);
        renderGuide();
    });

    els.pc1Cable.addEventListener("change", () => {
        state.cable.pc1 = els.pc1Cable.checked;
        state.pingSuccess = false;
        renderAll();
    });

    els.pc2Cable.addEventListener("change", () => {
        state.cable.pc2 = els.pc2Cable.checked;
        state.pingSuccess = false;
        renderAll();
    });

    els.openRunButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectPc(button.dataset.pc);
            openRun(button.dataset.pc);
        });
    });

    els.openAppButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectPc(button.dataset.pc);
            openCmd(button.dataset.pc);
        });
    });

    els.closeWindow.addEventListener("click", () => {
        els.windowsPanel.classList.remove("open");
    });
}

function restoreTheme() {
    const savedTheme = localStorage.getItem("academigo-praktek-theme");
    if (savedTheme === "dark") {
        els.body.classList.add("dark-mode");
        els.themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

function toggleTheme() {
    const isDark = els.body.classList.toggle("dark-mode");
    localStorage.setItem("academigo-praktek-theme", isDark ? "dark" : "light");
    els.themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

function selectPc(pcKey) {
    state.selectedPc = pcKey;
    els.deviceTabs.forEach((tab) => {
        const isActive = tab.dataset.pc === pcKey;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });
    renderLaptopSelection();
    renderGuide();
}

function renderAll() {
    renderGuide();
    renderCables();
    renderPcInfo();
    renderLaptopSelection();
    renderChecklist();
    renderNetworkStatus();
}

function renderLaptopSelection() {
    document.querySelectorAll("[data-pc-card]").forEach((card) => {
        card.classList.toggle("active-laptop", card.dataset.pcCard === state.selectedPc);
    });
}

function renderGuide() {
    els.guideTitle.textContent = `Langkah ${labels[state.selectedPc]}`;
    els.guideStep.textContent = `${state.currentStep + 1}/${guideSteps.length}`;
    els.guideText.textContent = guideSteps[state.currentStep];
    els.prevStep.disabled = state.currentStep === 0;
    els.nextStep.disabled = state.currentStep === guideSteps.length - 1;
}

function renderCables() {
    els.pc1Cable.checked = state.cable.pc1;
    els.pc2Cable.checked = state.cable.pc2;
    els.cableLeft.classList.toggle("active", state.cable.pc1);
    els.cableRight.classList.toggle("active", state.cable.pc2);
    els.port1.classList.toggle("active", state.cable.pc1);
    els.port2.classList.toggle("active", state.cable.pc2);
}

function renderPcInfo() {
    els.pc1Info.textContent = getPcInfoText("pc1");
    els.pc2Info.textContent = getPcInfoText("pc2");
}

function renderChecklist() {
    setStep("cable", state.cable.pc1 && state.cable.pc2);
    setStep("ipA", hasIpConfig("pc1"));
    setStep("ipB", hasIpConfig("pc2"));
    setStep("firewall", state.pc1.firewallOff && state.pc2.firewallOff);
    setStep("ping", state.pingSuccess);
}

function renderNetworkStatus() {
    if (state.pingSuccess) {
        showStatus("Ping berhasil. Kedua laptop sudah terhubung dan berada di jaringan yang sama.", "success");
        return;
    }

    if (!state.cable.pc1 || !state.cable.pc2) {
        showStatus("Ada kabel LAN yang belum terhubung ke switch. Periksa kabel dulu sebelum ping.", "error");
        return;
    }

    if (!hasIpConfig("pc1") || !hasIpConfig("pc2")) {
        showStatus("Atur IP Address dan Subnet Mask di kedua laptop melalui simulasi ncpa.cpl.", "");
        return;
    }

    if (!state.pc1.firewallOff || !state.pc2.firewallOff) {
        showStatus("IP sudah terisi. Lanjutkan ke Windows Defender Firewall dan matikan sementara di kedua laptop sebelum ping.", "success");
        return;
    }

    const check = getNetworkCheck();
    showStatus(check.ok ? "Jaringan siap diuji. Buka CMD dan ping IP laptop lawan." : check.reason, check.ok ? "success" : "error");
}

function setStep(step, done) {
    els.steps[step].classList.toggle("done", done);
}

function showStatus(message, type) {
    els.networkStatus.classList.remove("success", "error");
    if (type) els.networkStatus.classList.add(type);
    els.networkStatus.innerHTML = `<i class="fa-solid fa-circle-info"></i>${message}`;
}

function openRun(pcKey) {
    state.activeWindowPc = pcKey;
    openWindow("Run", renderRunDialog(pcKey));
}

function renderRunDialog(pcKey) {
    return `
        <div class="run-dialog">
            <i class="fa-brands fa-windows"></i>
            <div>
                <p class="dialog-copy">Ketik nama program, folder, dokumen, atau sumber internet yang ingin dibuka Windows.</p>
                <label class="field-label">
                    Open:
                    <input id="runCommand" type="text" autocomplete="off" placeholder="ncpa.cpl atau cmd">
                </label>
                <div class="dialog-actions">
                    <button class="mini-btn primary" id="runOk" type="button">OK</button>
                    <button class="mini-btn" id="runCancel" type="button">Cancel</button>
                </div>
                <p class="note">Coba ketik <strong>ncpa.cpl</strong> untuk Network Connections, <strong>control firewall.cpl</strong> untuk Windows Defender Firewall, atau <strong>cmd</strong> untuk Command Prompt.</p>
            </div>
        </div>
    `;
}

function wireRunDialog() {
    const input = document.getElementById("runCommand");
    const ok = document.getElementById("runOk");
    const cancel = document.getElementById("runCancel");
    const submit = () => handleRunCommand(input.value.trim().toLowerCase());

    ok.addEventListener("click", submit);
    cancel.addEventListener("click", () => els.windowsPanel.classList.remove("open"));
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") submit();
    });
    input.focus();
}

function handleRunCommand(command) {
    if (command === "ncpa.cpl") {
        openNetworkConnections(state.activeWindowPc);
        return;
    }

    if (command === "cmd") {
        openCmd(state.activeWindowPc);
        return;
    }

    if (command === "control firewall.cpl" || command === "firewall.cpl") {
        openFirewall(state.activeWindowPc);
        return;
    }

    showStatus(`Perintah Run "${command || "(kosong)"}" belum tepat. Coba ncpa.cpl, control firewall.cpl, atau cmd.`, "error");
}

function openNetworkConnections(pcKey) {
    state.activeWindowPc = pcKey;
    const cableOn = state.cable[pcKey];
    openWindow("Network Connections", `
        <div class="explorer-window">
            <div class="explorer-address">
                <div class="explorer-arrows">
                    <i class="fa-solid fa-arrow-left"></i>
                    <i class="fa-solid fa-arrow-right"></i>
                    <i class="fa-solid fa-chevron-up"></i>
                </div>
                <div class="breadcrumb">
                    <i class="fa-solid fa-network-wired"></i>
                    <span>Control Panel</span>
                    <i class="fa-solid fa-chevron-right"></i>
                    <span>Network and Internet</span>
                    <i class="fa-solid fa-chevron-right"></i>
                    <strong>Network Connections</strong>
                </div>
            </div>
            <div class="explorer-command">
                <span>Organize</span>
                <span>Disable this network device</span>
                <span>Diagnose this connection</span>
                <span>Rename this connection</span>
                <span>Change settings of this connection</span>
            </div>
            <div class="adapter-list">
                <div class="adapter">
                    <div class="adapter-icon">
                        <i class="fa-solid fa-desktop"></i>
                        <span class="adapter-badge"><i class="fa-solid fa-xmark"></i></span>
                    </div>
                    <div>
                        <span class="adapter-title">Bluetooth Network Connection</span>
                        <span class="adapter-status">Not connected</span>
                        <span class="adapter-desc">Bluetooth Device (Personal Area ...</span>
                    </div>
                </div>
                <button class="adapter selected" id="ethernetProperties" type="button">
                    <div class="adapter-icon">
                        <i class="fa-solid fa-desktop"></i>
                        ${cableOn ? "" : '<span class="adapter-badge"><i class="fa-solid fa-xmark"></i></span>'}
                    </div>
                    <div>
                        <span class="adapter-title">Ethernet</span>
                        <span class="adapter-status">${cableOn ? "Enabled" : "Network cable unplugged"}</span>
                        <span class="adapter-desc">Realtek Gaming GbE Family Contr...</span>
                    </div>
                </button>
                <div class="adapter">
                    <div class="adapter-icon">
                        <i class="fa-solid fa-desktop"></i>
                    </div>
                    <div>
                        <span class="adapter-title">Ethernet 2</span>
                        <span class="adapter-status">Enabled</span>
                        <span class="adapter-desc">VirtualBox Host-Only Ethernet Ad...</span>
                    </div>
                </div>
                <div class="adapter adapter-wifi">
                    <div class="adapter-icon">
                        <i class="fa-solid fa-desktop"></i>
                        <span class="adapter-badge"><i class="fa-solid fa-signal"></i></span>
                    </div>
                    <div>
                        <span class="adapter-title">Wi-Fi</span>
                        <span class="adapter-status">UnesaWifi 7</span>
                        <span class="adapter-desc">Intel(R) Wireless-AC 9560 160MHz</span>
                    </div>
                </div>
            </div>
        </div>
    `);
    document.getElementById("ethernetProperties").addEventListener("click", () => openEthernetProperties(pcKey));
}

function openEthernetProperties(pcKey) {
    state.activeWindowPc = pcKey;
    openWindow("Ethernet Properties", `
        <div class="properties-dialog">
            <div class="tabs">
                <strong>Networking</strong>
                <span>Sharing</span>
            </div>
            <div class="connect-row">
                <div>
                    <span>Connect using:</span>
                    <div class="nic-name">
                        <i class="fa-solid fa-desktop"></i>
                        <strong>Realtek Gaming GbE Family Controller</strong>
                    </div>
                </div>
                <button class="mini-btn" type="button">Configure...</button>
            </div>
            <p class="dialog-copy">This connection uses the following items:</p>
            <div class="items-box">
                <div class="network-item selected">
                    <span class="fake-check">✓</span>
                    <i class="fa-solid fa-desktop"></i>
                    <span>Client for Microsoft Networks</span>
                </div>
                <div class="network-item">
                    <span class="fake-check">✓</span>
                    <i class="fa-solid fa-desktop"></i>
                    <span>File and Printer Sharing for Microsoft Networks</span>
                </div>
                <div class="network-item">
                    <span class="fake-check">✓</span>
                    <i class="fa-solid fa-desktop"></i>
                    <span>VirtualBox NDIS6 Bridged Networking Driver</span>
                </div>
                <div class="network-item">
                    <span class="fake-check">✓</span>
                    <i class="fa-solid fa-desktop"></i>
                    <span>QoS Packet Scheduler</span>
                </div>
                <button class="network-item" id="ipv4Properties" type="button">
                    <span class="fake-check">✓</span>
                    <i class="fa-solid fa-network-wired"></i>
                    <span>Internet Protocol Version 4 (TCP/IPv4)</span>
                </button>
                <div class="network-item">
                    <span class="fake-check"></span>
                    <i class="fa-solid fa-network-wired"></i>
                    <span>Microsoft Network Adapter Multiplexor Protocol</span>
                </div>
                <div class="network-item">
                    <span class="fake-check">✓</span>
                    <i class="fa-solid fa-network-wired"></i>
                    <span>Microsoft LLDP Protocol Driver</span>
                </div>
            </div>
            <div class="property-buttons">
                <button class="mini-btn" type="button">Install...</button>
                <button class="mini-btn" type="button">Uninstall</button>
                <button class="mini-btn primary" id="ipv4PropertiesBottom" type="button">Properties</button>
            </div>
            <div class="description-box">
                <strong>Description</strong>
                <p class="note">Allows your computer to access resources on a Microsoft network.</p>
            </div>
            <div class="dialog-bottom">
                <button class="mini-btn primary" id="ethernetOk" type="button">OK</button>
                <button class="mini-btn" id="ethernetCancel" type="button">Cancel</button>
            </div>
        </div>
    `);
    document.getElementById("ipv4Properties").addEventListener("click", () => openIpv4Properties(pcKey));
    document.getElementById("ipv4PropertiesBottom").addEventListener("click", () => openIpv4Properties(pcKey));
    document.getElementById("ethernetOk").addEventListener("click", () => openNetworkConnections(pcKey));
    document.getElementById("ethernetCancel").addEventListener("click", () => openNetworkConnections(pcKey));
}

function openIpv4Properties(pcKey) {
    state.activeWindowPc = pcKey;
    state[pcKey].ipv4Opened = true;
    
    // Perubahan: Hilangkan subnet default agar kosong di awal
    openWindow(`IPv4 Properties - ${labels[pcKey]}`, `
        <div class="ipv4-dialog">
            <div class="tabs">
                <strong>General</strong>
                <span>Alternate Configuration</span>
            </div>
            <p class="ipv4-copy">You can get IP settings assigned automatically if your network supports this capability. Otherwise, you need to ask your network administrator for the appropriate IP settings.</p>
            <label class="radio-row">
                <input id="ipModeAuto" type="radio" name="ipMode">
                <span>Obtain an IP address automatically</span>
            </label>
            <label class="radio-row">
                <input id="ipModeManual" type="radio" name="ipMode" checked>
                <span>Use the following IP address:</span>
            </label>
            <div class="ipv4-fields">
                <div class="ip-line">
                    <label>IP address:</label>
                    ${renderIpBoxes("ip", state[pcKey].ip)}
                </div>
                <div class="ip-line">
                    <label>Subnet mask:</label>
                    ${renderIpBoxes("subnet", state[pcKey].subnet || "")}
                </div>
                <div class="ip-line">
                    <label>Default gateway:</label>
                    ${renderIpBoxes("gateway", "")}
                </div>
            </div>
            <div class="dns-section">
                <label class="radio-row">
                    <input id="dnsModeAuto" type="radio" name="dnsMode">
                    <span>Obtain DNS server address automatically</span>
                </label>
                <label class="radio-row">
                    <input id="dnsModeManual" type="radio" name="dnsMode" checked>
                    <span>Use the following DNS server addresses:</span>
                </label>
                <div class="ipv4-fields">
                    <div class="ip-line">
                        <label>Preferred DNS server:</label>
                        ${renderIpBoxes("dns1", "1.1.1.1")}
                    </div>
                    <div class="ip-line">
                        <label>Alternate DNS server:</label>
                        ${renderIpBoxes("dns2", "1.0.0.1")}
                    </div>
                </div>
            </div>
            <label class="validate-row">
                <input type="checkbox">
                <span>Validate settings upon exit</span>
            </label>
            <div class="dialog-bottom">
                <button class="mini-btn" type="button">Advanced...</button>
                <button class="mini-btn primary" id="saveIpv4" type="button">OK</button>
                <button class="mini-btn" id="closeIpv4" type="button">Cancel</button>
            </div>
        </div>
    `);
    document.getElementById("saveIpv4").addEventListener("click", () => saveIpv4(pcKey));
    document.getElementById("closeIpv4").addEventListener("click", () => openEthernetProperties(pcKey));
    
    wireIpBoxNavigation();
    wireAutoSubnetMask(); // Tambahan fitur auto fill Subnet Mask
    wireIpv4ModeControls();
}

function wireAutoSubnetMask() {
    const subnetBoxes = document.querySelectorAll('.ip-part[data-group="subnet"]');
    subnetBoxes.forEach(box => {
        box.addEventListener('focus', () => {
            const currentSubnet = readIpBoxes("subnet").replace(/\./g, "");
            
            // Cek jika subnet saat ini benar-benar kosong
            if (currentSubnet === "") {
                const ipString = readIpBoxes("ip");
                const firstOctet = parseInt(ipString.split('.')[0], 10);

                // Cek octet pertama untuk menentukan Class IP
                if (!isNaN(firstOctet)) {
                    let mask = ["255", "255", "255", "0"]; // Default Class C
                    
                    if (firstOctet >= 1 && firstOctet <= 127) {
                        mask = ["255", "0", "0", "0"]; // Class A
                    } else if (firstOctet >= 128 && firstOctet <= 191) {
                        mask = ["255", "255", "0", "0"]; // Class B
                    }

                    // Isi otomatis ke kolom subnet
                    subnetBoxes.forEach((b, index) => {
                        b.value = mask[index];
                    });

                    // Sorot box yang sedang difokuskan agar mirip Windows asli
                    box.select();
                }
            }
        });
    });
}

function saveIpv4(pcKey) {
    const manualIp = document.getElementById("ipModeManual").checked;
    if (!manualIp) {
        state[pcKey].ip = "";
        state[pcKey].subnet = "";
        state.pingSuccess = false;
        renderAll();
        showStatus(`${labels[pcKey]} memakai mode otomatis. Untuk praktik ping manual, pilih "Use the following IP address" lalu isi IP.`, "error");
        return;
    }

    const ip = readIpBoxes("ip");
    const subnet = readIpBoxes("subnet");

    if (!isValidIPv4(ip) || !isValidIPv4(subnet)) {
        showStatus("Format IP Address atau Subnet Mask belum benar. Contoh format: 192.168.1.10", "error");
        return;
    }

    state[pcKey].ip = ip;
    state[pcKey].subnet = subnet;
    state.pingSuccess = false;
    renderAll();
    showStatus(`${labels[pcKey]} sudah menyimpan IP ${ip} dengan subnet ${subnet}.`, "success");
    openEthernetProperties(pcKey);
}

function renderIpBoxes(name, value) {
    const parts = value && isValidIPv4(value) ? value.split(".") : ["", "", "", ""];
    return `
        <div class="ip-boxes" data-ip-group="${name}">
            ${parts.map((part, index) => `
                <input class="ip-part" data-group="${name}" data-index="${index}" type="text" inputmode="numeric" maxlength="3" value="${part}">
                ${index < 3 ? "<span>.</span>" : ""}
            `).join("")}
        </div>
    `;
}

function readIpBoxes(name) {
    return Array.from(document.querySelectorAll(`.ip-part[data-group="${name}"]`))
        .map((input) => input.value.trim())
        .join(".");
}

function wireIpBoxNavigation() {
    document.querySelectorAll(".ip-part").forEach((input) => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "").slice(0, 3);
            if (input.value.length === 3) {
                const group = input.dataset.group;
                const nextIndex = Number(input.dataset.index) + 1;
                const next = document.querySelector(`.ip-part[data-group="${group}"][data-index="${nextIndex}"]`);
                if (next) next.focus();
            }
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "." || event.key === "ArrowRight") {
                event.preventDefault();
                focusSiblingIpPart(input, 1);
            }
            if (event.key === "Backspace" && input.value === "") {
                focusSiblingIpPart(input, -1);
            }
        });
    });
}

function focusSiblingIpPart(input, offset) {
    const group = input.dataset.group;
    const nextIndex = Number(input.dataset.index) + offset;
    const next = document.querySelector(`.ip-part[data-group="${group}"][data-index="${nextIndex}"]`);
    if (next && !next.disabled) next.focus();
}

function wireIpv4ModeControls() {
    const ipAuto = document.getElementById("ipModeAuto");
    const ipManual = document.getElementById("ipModeManual");
    const dnsAuto = document.getElementById("dnsModeAuto");
    const dnsManual = document.getElementById("dnsModeManual");

    const updateIpMode = () => {
        setIpGroupDisabled("ip", ipAuto.checked);
        setIpGroupDisabled("subnet", ipAuto.checked);
        setIpGroupDisabled("gateway", ipAuto.checked);
    };

    const updateDnsMode = () => {
        setIpGroupDisabled("dns1", dnsAuto.checked);
        setIpGroupDisabled("dns2", dnsAuto.checked);
    };

    ipAuto.addEventListener("change", updateIpMode);
    ipManual.addEventListener("change", updateIpMode);
    dnsAuto.addEventListener("change", updateDnsMode);
    dnsManual.addEventListener("change", updateDnsMode);

    updateIpMode();
    updateDnsMode();
}

function setIpGroupDisabled(group, disabled) {
    document.querySelectorAll(`.ip-part[data-group="${group}"]`).forEach((input) => {
        input.disabled = disabled;
    });
}

function openFirewall(pcKey) {
    state.activeWindowPc = pcKey;
    openWindow(`Windows Defender Firewall - ${labels[pcKey]}`, `
        <div class="firewall-page">
            ${renderFirewallBreadcrumb("Windows Defender Firewall")}
            <div class="firewall-layout">
                <aside class="firewall-sidebar">
                    <button type="button">Control Panel Home</button>
                    <button type="button">Allow an app or feature through Windows Defender Firewall</button>
                    <button type="button">Change notification settings</button>
                    <button id="openFirewallCustomize" type="button"><i class="fa-solid fa-shield-halved"></i> Turn Windows Defender Firewall on or off</button>
                    <button type="button"><i class="fa-solid fa-shield-halved"></i> Restore defaults</button>
                    <button type="button"><i class="fa-solid fa-shield-halved"></i> Advanced settings</button>
                    <button type="button">Troubleshoot my network</button>
                </aside>
                <section class="firewall-main">
                    <h2>Help protect your PC with Windows Defender Firewall</h2>
                    <p>Windows Defender Firewall can help prevent hackers or malicious software from gaining access to your PC through the Internet or a network.</p>
                    <div class="firewall-alert ${state[pcKey].firewallOff ? "is-off" : "is-on"}">
                        <div></div>
                        <div>
                            <strong>${state[pcKey].firewallOff ? "Update your Firewall settings" : "Windows Defender Firewall is helping protect your computer"}</strong>
                            <p>${state[pcKey].firewallOff ? "Windows Defender Firewall is not using the recommended settings to protect your computer." : "Firewall is turned on for this laptop."}</p>
                            <a href="#">What are the recommended settings?</a>
                        </div>
                        <button class="mini-btn" id="useRecommendedFirewall" type="button"><i class="fa-solid fa-shield-halved"></i> Use recommended settings</button>
                    </div>
                    ${renderFirewallNetwork("Private networks", "Not connected", state[pcKey].firewallOff)}
                    ${renderFirewallNetwork("Guest or public networks", "Connected", state[pcKey].firewallOff, true)}
                </section>
            </div>
        </div>
    `);
    document.getElementById("openFirewallCustomize").addEventListener("click", () => openFirewallCustomize(pcKey));
    document.getElementById("useRecommendedFirewall").addEventListener("click", () => {
        state[pcKey].firewallOff = false;
        state.pingSuccess = false;
        renderAll();
        openFirewall(pcKey);
    });
}

function renderFirewallBreadcrumb(current) {
    return `
        <div class="explorer-address firewall-address">
            <div class="explorer-arrows">
                <i class="fa-solid fa-arrow-left"></i>
                <i class="fa-solid fa-arrow-right"></i>
                <i class="fa-solid fa-chevron-up"></i>
            </div>
            <div class="breadcrumb">
                <i class="fa-solid fa-shield-halved"></i>
                <span>Control Panel</span>
                <i class="fa-solid fa-chevron-right"></i>
                <span>System and Security</span>
                <i class="fa-solid fa-chevron-right"></i>
                <strong>${current}</strong>
            </div>
        </div>
    `;
}

function renderFirewallNetwork(title, connection, isOff, expanded = false) {
    return `
        <div class="firewall-network ${expanded ? "expanded" : ""} ${isOff ? "is-off" : "is-on"}">
            <div class="firewall-network-head">
                <span class="firewall-redbar"></span>
                <i class="fa-solid ${isOff ? "fa-shield-xmark" : "fa-shield-halved"}"></i>
                <strong>${title}</strong>
                <span>${connection}</span>
                <i class="fa-solid fa-chevron-${expanded ? "up" : "down"}"></i>
            </div>
            ${expanded ? `
                <div class="firewall-network-body">
                    <p>Networks in public places such as airports or coffee shops</p>
                    <div class="firewall-info-grid">
                        <span>Windows Defender Firewall state:</span><strong>${isOff ? "Off" : "On"}</strong>
                        <span>Incoming connections:</span><span>Block all connections to apps that are not on the list of allowed apps</span>
                        <span>Active public networks:</span><span>UnesaWifi 7</span>
                        <span>Notification state:</span><span>Notify me when Windows Defender Firewall blocks a new app</span>
                    </div>
                </div>
            ` : ""}
        </div>
    `;
}

function openFirewallCustomize(pcKey) {
    state.activeWindowPc = pcKey;
    openWindow(`Customize Settings - ${labels[pcKey]}`, `
        <div class="firewall-page">
            ${renderFirewallBreadcrumb("Customize Settings")}
            <div class="firewall-customize">
                <h2>Customize settings for each type of network</h2>
                <p>You can modify the firewall settings for each type of network that you use.</p>

                <section class="firewall-setting-group">
                    <h3>Private network settings</h3>
                    ${renderFirewallChoice("private", state[pcKey].firewallOff)}
                </section>

                <section class="firewall-setting-group">
                    <h3>Public network settings</h3>
                    ${renderFirewallChoice("public", state[pcKey].firewallOff)}
                </section>

                <div class="dialog-bottom">
                    <button class="mini-btn primary" id="saveFirewallSettings" type="button">OK</button>
                    <button class="mini-btn" id="cancelFirewallSettings" type="button">Cancel</button>
                </div>
            </div>
        </div>
    `);
    document.getElementById("saveFirewallSettings").addEventListener("click", () => {
        const privateOff = document.getElementById("privateFirewallOff").checked;
        const publicOff = document.getElementById("publicFirewallOff").checked;
        state[pcKey].firewallOff = privateOff && publicOff;
        state.pingSuccess = false;
        renderAll();
        showStatus(state[pcKey].firewallOff ? `${labels[pcKey]}: Private dan Public Firewall sudah dimatikan sementara.` : `${labels[pcKey]}: Firewall masih aktif pada salah satu jaringan.`, state[pcKey].firewallOff ? "success" : "error");
        openFirewall(pcKey);
    });
    document.getElementById("cancelFirewallSettings").addEventListener("click", () => openFirewall(pcKey));
}

function renderFirewallChoice(scope, isOff) {
    const title = scope === "private" ? "Private" : "Public";
    return `
        <div class="firewall-choice-row">
            <i class="fa-solid fa-shield-halved shield-on"></i>
            <label>
                <input type="radio" name="${scope}Firewall" id="${scope}FirewallOn" ${isOff ? "" : "checked"}>
                <span>Turn on Windows Defender Firewall</span>
            </label>
        </div>
        <label class="firewall-sub-option">
            <input type="checkbox" disabled>
            <span>Block all incoming connections, including those in the list of allowed apps</span>
        </label>
        <label class="firewall-sub-option">
            <input type="checkbox" checked disabled>
            <span>Notify me when Windows Defender Firewall blocks a new app</span>
        </label>
        <div class="firewall-choice-row">
            <i class="fa-solid fa-shield-xmark shield-off"></i>
            <label>
                <input type="radio" name="${scope}Firewall" id="${scope}FirewallOff" ${isOff ? "checked" : ""}>
                <span>Turn off Windows Defender Firewall (not recommended)</span>
            </label>
        </div>
    `;
}

function openCmd(pcKey) {
    state.activeWindowPc = pcKey;
    state.activeTerminalPc = pcKey;
    if (!state.terminalOutput[pcKey]) {
        state.terminalOutput[pcKey] = `Microsoft Windows [Version 10.0.19045]\nAcademiGo Command Prompt - ${labels[pcKey]}\nKetik ipconfig, ping <ip-lawan>, status, atau cls.`;
    }

    openWindow(`Command Prompt - ${labels[pcKey]}`, `
        <div class="terminal-window">
            <div class="terminal-output" id="terminalOutput">${escapeHtml(state.terminalOutput[pcKey])}</div>
            <form class="terminal-input-row" id="terminalForm">
                <span>${pcKey}&gt;</span>
                <input id="terminalInput" type="text" autocomplete="off" placeholder="Contoh: ping 192.168.1.11">
            </form>
        </div>
    `);

    const form = document.getElementById("terminalForm");
    const input = document.getElementById("terminalInput");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        runCommand(input.value);
        input.value = "";
    });
    input.focus();
    scrollTerminal();
}

function runCommand(rawCommand) {
    const command = rawCommand.trim();
    if (!command) return;

    appendTerminal(`${state.activeTerminalPc}> ${command}`);

    const normalized = command.toLowerCase();
    if (normalized === "cls" || normalized === "clear") {
        state.terminalOutput[state.activeTerminalPc] = "";
        openCmd(state.activeTerminalPc);
        return;
    }

    if (normalized === "help") {
        appendTerminal("Perintah: ipconfig, ping <ip-tujuan>, status, cls");
        return;
    }

    if (normalized === "ipconfig") {
        const pc = state[state.activeTerminalPc];
        appendTerminal([
            "Ethernet adapter Local Area Connection:",
            `   IPv4 Address. . . . . . . . . . . : ${pc.ip || "0.0.0.0"}`,
            `   Subnet Mask . . . . . . . . . . . : ${pc.subnet || "0.0.0.0"}`,
            "   Default Gateway . . . . . . . . . :"
        ].join("\n"));
        return;
    }

    if (normalized === "status") {
        appendTerminal(getStatusReport());
        return;
    }

    if (normalized.startsWith("ping ")) {
        handlePing(command.slice(5).trim());
        return;
    }

    appendTerminal(`'${command}' tidak dikenali sebagai perintah. Coba ketik help.`);
}

function handlePing(destinationIp) {
    const source = state.activeTerminalPc;
    const target = source === "pc1" ? "pc2" : "pc1";
    const check = getNetworkCheck();

    if (!isValidIPv4(destinationIp)) {
        appendTerminal("Ping gagal: format IP tujuan tidak valid.");
        return;
    }

    if (destinationIp !== state[target].ip) {
        appendTerminal(`Destination host unreachable.\nIP ${labels[target]} saat ini adalah ${state[target].ip || "belum diatur"}.`);
        return;
    }

    if (!check.ok) {
        appendTerminal(`Request timed out.\nPenyebab: ${check.reason}`);
        state.pingSuccess = false;
        renderAll();
        return;
    }

    state.pingSuccess = true;
    appendTerminal([
        `Pinging ${destinationIp} with 32 bytes of data:`,
        `Reply from ${destinationIp}: bytes=32 time<1ms TTL=128`,
        `Reply from ${destinationIp}: bytes=32 time<1ms TTL=128`,
        `Reply from ${destinationIp}: bytes=32 time<1ms TTL=128`,
        `Reply from ${destinationIp}: bytes=32 time<1ms TTL=128`,
        "",
        `Ping statistics for ${destinationIp}:`,
        "    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)"
    ].join("\n"));
    renderAll();
}

function appendTerminal(text) {
    state.terminalOutput[state.activeTerminalPc] += `\n${text}`;
    const output = document.getElementById("terminalOutput");
    if (output) {
        output.textContent = state.terminalOutput[state.activeTerminalPc];
        scrollTerminal();
    }
}

function scrollTerminal() {
    const output = document.getElementById("terminalOutput");
    if (output) output.scrollTop = output.scrollHeight;
}

function getStatusReport() {
    const check = getNetworkCheck();
    return [
        `Kabel Laptop A: ${state.cable.pc1 ? "terhubung" : "terputus"}`,
        `Kabel Laptop B: ${state.cable.pc2 ? "terhubung" : "terputus"}`,
        `IP Laptop A: ${state.pc1.ip || "belum diatur"} / ${state.pc1.subnet || "-"}`,
        `IP Laptop B: ${state.pc2.ip || "belum diatur"} / ${state.pc2.subnet || "-"}`,
        `Firewall Laptop A: ${state.pc1.firewallOff ? "off sementara" : "on"}`,
        `Firewall Laptop B: ${state.pc2.firewallOff ? "off sementara" : "on"}`,
        `Jaringan: ${check.ok ? "siap ping" : check.reason}`
    ].join("\n");
}

function getNetworkCheck() {
    if (!state.cable.pc1 || !state.cable.pc2) {
        return { ok: false, reason: "kabel LAN belum lengkap ke switch." };
    }

    if (!hasIpConfig("pc1") || !hasIpConfig("pc2")) {
        return { ok: false, reason: "IP Address atau Subnet Mask belum diatur di kedua laptop." };
    }

    if (state.pc1.ip === state.pc2.ip) {
        return { ok: false, reason: "IP kedua laptop tidak boleh sama." };
    }

    if (state.pc1.subnet !== state.pc2.subnet) {
        return { ok: false, reason: "Subnet Mask kedua laptop harus sama untuk praktik dasar ini." };
    }

    if (!isSameNetwork(state.pc1.ip, state.pc2.ip, state.pc1.subnet)) {
        return { ok: false, reason: "IP kedua laptop belum berada pada network yang sama." };
    }

    if (!state.pc1.firewallOff || !state.pc2.firewallOff) {
        return { ok: false, reason: "Windows Firewall masih aktif di salah satu laptop." };
    }

    return { ok: true, reason: "" };
}

function hasIpConfig(pcKey) {
    return isValidIPv4(state[pcKey].ip) && isValidIPv4(state[pcKey].subnet);
}

function getPcInfoText(pcKey) {
    const pc = state[pcKey];
    const firewall = pc.firewallOff ? "Firewall off" : "Firewall on";
    if (!pc.ip || !pc.subnet) return `IP belum diatur | ${firewall}`;
    return `IP ${pc.ip} | Mask ${pc.subnet} | ${firewall}`;
}

function isValidIPv4(value) {
    const parts = value.split(".");
    return parts.length === 4 && parts.every((part) => {
        if (!/^\d+$/.test(part)) return false;
        const number = Number(part);
        return number >= 0 && number <= 255 && String(number) === part;
    });
}

function isSameNetwork(ipA, ipB, mask) {
    const a = ipv4ToNumbers(ipA);
    const b = ipv4ToNumbers(ipB);
    const m = ipv4ToNumbers(mask);
    if (!a || !b || !m) return false;
    return a.every((part, index) => (part & m[index]) === (b[index] & m[index]));
}

function ipv4ToNumbers(value) {
    if (!isValidIPv4(value)) return null;
    return value.split(".").map(Number);
}

function openWindow(title, bodyHtml) {
    moveWindowIntoActiveLaptop();
    els.windowTitle.textContent = title;
    els.windowBody.innerHTML = bodyHtml;
    els.windowsPanel.classList.add("in-laptop");
    els.windowsPanel.classList.add("open");

    if (title === "Run") {
        wireRunDialog();
    }

    window.setTimeout(() => {
        els.windowsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
}

function moveWindowIntoActiveLaptop() {
    const desktop = document.querySelector(`[data-pc-card="${state.activeWindowPc}"] .desktop`);
    if (desktop && els.windowsPanel.parentElement !== desktop) {
        desktop.appendChild(els.windowsPanel);
    }
}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}