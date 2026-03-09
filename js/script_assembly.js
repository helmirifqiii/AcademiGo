const components = document.querySelectorAll('.component');
const dropZones = document.querySelectorAll('.drop-zone');
let installedCount = 0;

components.forEach(comp => {
    comp.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault(); // Mengizinkan drop
        zone.style.background = "rgba(46, 204, 113, 0.2)";
    });

    zone.addEventListener('dragleave', () => {
        zone.style.background = "rgba(255, 255, 255, 0.1)";
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        const compId = e.dataTransfer.getData('text/plain');
        const component = document.getElementById(compId);
        const targetType = zone.getAttribute('data-accept');

        if (compId === targetType) {
            zone.style.background = "#27ae60";
            zone.innerText = component.innerText;
            zone.style.border = "none";
            component.classList.add('installed');
            component.draggable = false;
            component.style.opacity = "0.5";
            
            installedCount++;
            checkCompletion();
        } else {
            zone.style.background = "rgba(255, 255, 255, 0.1)";
            alert("Salah! Komponen tersebut tidak cocok di slot ini.");
        }
    });
});

function checkCompletion() {
    const status = document.getElementById('status-msg');
    if (installedCount === components.length) {
        status.innerText = "🎉 PC Berhasil Dirakit! Siap dinyalakan.";
        status.style.color = "#27ae60";
    } else {
        status.innerText = `Komponen terpasang: ${installedCount} / ${components.length}`;
    }
}