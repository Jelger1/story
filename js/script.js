/* ===========================================
   HEERLEN: DE STORY VAN HET ZWARTE GOUD
   Main JavaScript
   =========================================== */

// --- CHART INSTANCES (voor cleanup) ---
let chartInstances = {};

// ===========================================
// NAVIGATION LOGIC
// ===========================================

function showNavigator() {
    document.getElementById('intro').classList.add('hidden-section');
    document.getElementById('navigator').classList.remove('hidden-section');
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function startStory(id) {
    // Verberg alle story secties eerst
    document.querySelectorAll('[id^="story-"]').forEach(el => el.classList.add('hidden-section'));
    document.getElementById('navigator').classList.add('hidden-section');
    document.getElementById('story-' + id).classList.remove('hidden-section');
    document.getElementById('timeline-ui').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Wacht even tot DOM geupdate is, dan charts initialiseren
    setTimeout(() => initCharts(), 100);
}

function finishStory() {
    document.querySelectorAll('[id^="story-"]').forEach(el => el.classList.add('hidden-section'));
    document.getElementById('story-val').classList.remove('hidden-section');
    document.getElementById('timeline-ui').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function backToNavigator() {
    // Destroy alle charts bij teruggaan
    destroyCharts();
    document.querySelectorAll('[id^="story-"]').forEach(el => el.classList.add('hidden-section'));
    document.getElementById('timeline-ui').classList.add('hidden');
    document.getElementById('navigator').classList.remove('hidden-section');
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// ===========================================
// SCROLL PROGRESS
// ===========================================

window.addEventListener('scroll', function() {
    const fill = document.getElementById("fill");
    if (!fill) return;
    
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    fill.style.height = scrolled + "%";
    
    // Marker activation logic - aangepast op de juiste posities
    const markerPositions = [10, 30, 50, 70, 90];
    let markers = document.querySelectorAll('.marker');
    markers.forEach((m, idx) => {
        if (scrolled >= markerPositions[idx] - 5) {
            m.classList.add('active');
        } else {
            m.classList.remove('active');
        }
    });
});

// ===========================================
// CHART UTILITIES
// ===========================================

function destroyCharts() {
    Object.values(chartInstances).forEach(chart => {
        if (chart) chart.destroy();
    });
    chartInstances = {};
}

// Label wrapping voor charts
function wrap(label) {
    if (label.length <= 16) return label;
    let words = label.split(' ');
    let lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        if ((currentLine + " " + words[i]).length < 16) {
            currentLine += " " + words[i];
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    return lines;
}

// Tooltip configuratie
const tooltipConfig = {
    callbacks: {
        title: function(items) {
            let label = items[0].chart.data.labels[items[0].dataIndex];
            return Array.isArray(label) ? label.join(' ') : label;
        }
    }
};

// ===========================================
// CHART INITIALIZATION
// ===========================================

function initCharts() {
    // Destroy bestaande charts eerst
    destroyCharts();

    // Chart Wealth - Kolenprijs over tijd
    const ctx1 = document.getElementById('chartWealth1');
    if (ctx1 && ctx1.getContext) {
        chartInstances.wealth = new Chart(ctx1.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['1900', '1910', '1917', '1925'].map(wrap),
                datasets: [{
                    label: 'Prijsindex Kolen',
                    data: [10, 15, 60, 45],
                    borderColor: '#ffeb00',
                    fill: true,
                    backgroundColor: 'rgba(255, 235, 0, 0.1)',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: tooltipConfig,
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: '#888' }, grid: { color: '#333' } },
                    y: { ticks: { color: '#888' }, grid: { color: '#333' } }
                }
            }
        });
    }

    // Chart Migrant Mix - Herkomst bevolking
    const ctx2 = document.getElementById('chartMigrantMix');
    if (ctx2 && ctx2.getContext) {
        chartInstances.migrant = new Chart(ctx2.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Limburgers', 'Drenten/Noord', 'Polen', 'Duitsers', 'Overig'].map(wrap),
                datasets: [{
                    data: [55, 15, 14, 12, 4],
                    backgroundColor: ['#ffeb00', '#ffffff', '#888', '#555', '#333'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: tooltipConfig,
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fff', padding: 15 }
                    }
                }
            }
        });
    }

    // Chart Hierarchy - Mijnwerkers status
    const ctx3 = document.getElementById('chartHierarchy');
    if (ctx3 && ctx3.getContext) {
        chartInstances.hierarchy = new Chart(ctx3.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Houwers', 'Slepers', 'Piemels', 'Beambten'].map(wrap),
                datasets: [{
                    label: 'Status Index',
                    data: [100, 70, 30, 90],
                    backgroundColor: '#ffeb00',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: tooltipConfig,
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: '#888' }, grid: { display: false } },
                    y: { ticks: { color: '#888' }, grid: { color: '#333' } }
                }
            }
        });
    }
}

// ===========================================
// SECTION AUDIO OBSERVERS
// ===========================================

function initSectionAudio() {
    // Setup audio observers for sections with sound
    const audioSections = [
        { sectionId: 'kanarie-section', audioId: 'kanarie-audio' },
        { sectionId: 'barbara-section', audioId: 'barbara-audio' }
    ];
    
    audioSections.forEach(({ sectionId, audioId }) => {
        const section = document.getElementById(sectionId);
        const audio = document.getElementById(audioId);
        
        if (!section || !audio) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Section is in view - play audio
                    audio.play().catch(e => console.log('Audio play blocked:', e));
                } else {
                    // Section is out of view - pause and reset audio
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of the section is visible
        });
        
        observer.observe(section);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSectionAudio();
    
    // Show start button after 5 seconds
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        setTimeout(() => {
            startBtn.classList.remove('opacity-0');
            startBtn.classList.add('opacity-100');
        }, 5000);
    }
});
