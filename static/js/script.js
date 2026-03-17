// ============================================================
// Presentation Coach — Frontend JavaScript
// ============================================================

// ─── DOM Elements ────────────────────────────────────────
const micButton = document.getElementById('micButton');
const startSessionBtn = document.getElementById('startSessionBtn');
const endSessionBtn = document.getElementById('endSessionBtn');
const timerEl = document.getElementById('timer');
const transcriptBox = document.getElementById('transcriptBox');
const fillerCountEl = document.getElementById('fillerCount');
const wpmValue = document.getElementById('wpmValue');
const fillerValue = document.getElementById('fillerValue');
const clarityValue = document.getElementById('clarityValue');
const suggestionsList = document.getElementById('suggestionsList');
const paceBar = document.getElementById('paceBar');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const scriptInput = document.getElementById('scriptInput');
const wordCountEl = document.getElementById('wordCount');

// ─── Particle System ────────────────────────────────────
(function initParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    const count = 25;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (12 + Math.random() * 18) + 's';
        p.style.animationDelay = -(Math.random() * 20) + 's';
        p.style.opacity = 0.2 + Math.random() * 0.5;
        container.appendChild(p);
    }
})();

// ─── Animated Counter ───────────────────────────────────
function animateValue(el, newVal, duration) {
    if (!el) return;
    const startVal = parseInt(el.textContent) || 0;
    if (startVal === newVal) return;
    const diff = newVal - startVal;
    const startTime = performance.now();
    const d = duration || 400;
    function step(now) {
        const progress = Math.min((now - startTime) / d, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(startVal + diff * eased);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ─── Color-Coded Metrics ────────────────────────────────
function getWpmClass(wpm) {
    if (wpm === 0) return '';
    if (wpm >= 120 && wpm <= 150) return 'metric-good';
    if ((wpm >= 100 && wpm < 120) || (wpm > 150 && wpm <= 170)) return 'metric-warn';
    return 'metric-bad';
}

function getClarityClass(clarity) {
    if (clarity >= 80) return 'metric-good';
    if (clarity >= 60) return 'metric-warn';
    return 'metric-bad';
}

function getFillerClass(count) {
    if (count <= 2) return 'metric-good';
    if (count <= 5) return 'metric-warn';
    return 'metric-bad';
}

function getMetricColor(cls) {
    if (cls === 'metric-good') return '#48bb78';
    if (cls === 'metric-warn') return '#ed8936';
    if (cls === 'metric-bad') return '#f5576c';
    return '#667eea';
}

// ─── Circular Gauge ─────────────────────────────────────
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 50; // r=50

function updateGauge(fillEl, percent, colorClass) {
    if (!fillEl) return;
    const offset = GAUGE_CIRCUMFERENCE * (1 - Math.min(1, percent / 100));
    fillEl.style.strokeDashoffset = offset;
    fillEl.style.stroke = getMetricColor(colorClass);
}

// ─── WPM Sparkline ──────────────────────────────────────
const wpmHistory = [];
const MAX_SPARKLINE_POINTS = 30;
const sparklineCanvas = document.getElementById('wpmSparkline');

function addWpmDataPoint(wpm) {
    wpmHistory.push(wpm);
    if (wpmHistory.length > MAX_SPARKLINE_POINTS) wpmHistory.shift();
    drawSparkline();
}

function drawSparkline() {
    if (!sparklineCanvas) return;
    const ctx = sparklineCanvas.getContext('2d');
    const W = sparklineCanvas.offsetWidth;
    const H = sparklineCanvas.offsetHeight;
    sparklineCanvas.width = W * 2;
    sparklineCanvas.height = H * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, W, H);

    if (wpmHistory.length < 2) return;

    const max = Math.max(...wpmHistory, 200);
    const min = 0;
    const range = max - min || 1;
    const step = W / (MAX_SPARKLINE_POINTS - 1);

    // Fill gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.0)');

    ctx.beginPath();
    ctx.moveTo(0, H);
    wpmHistory.forEach((val, i) => {
        const x = i * step;
        const y = H - ((val - min) / range) * (H - 8) - 4;
        if (i === 0) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.lineTo((wpmHistory.length - 1) * step, H);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    wpmHistory.forEach((val, i) => {
        const x = i * step;
        const y = H - ((val - min) / range) * (H - 8) - 4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Current point
    const lastX = (wpmHistory.length - 1) * step;
    const lastY = H - ((wpmHistory[wpmHistory.length - 1] - min) / range) * (H - 8) - 4;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#667eea';
    ctx.fill();
}
const timeEstimate = document.getElementById('timeEstimate');
const loadScriptBtn = document.getElementById('loadScriptBtn');
const clearScriptBtn = document.getElementById('clearScriptBtn');
const scriptAnalysis = document.getElementById('scriptAnalysis');
const apiStatus = document.getElementById('apiStatus');

// Modal elements
const analysisModal = document.getElementById('analysisModal');
const closeModalBtn = document.getElementById('closeModal');
const newSessionBtn = document.getElementById('newSessionBtn');
const analysisSummary = document.getElementById('analysisSummary');
const strengthsList = document.getElementById('strengthsList');
const improvementsList = document.getElementById('improvementsList');
const recommendationsList = document.getElementById('recommendationsList');

// ─── Teleprompter ───────────────────────────────────────
const teleprompterContainer = document.getElementById('teleprompterContainer');
const teleprompterBox = document.getElementById('teleprompterBox');
const teleprompterProgress = document.getElementById('teleprompterProgress');
const teleprompterEmpty = document.getElementById('teleprompterEmpty');

let tpWords = [];       // array of lowercase script words
let tpElements = [];    // corresponding <span> DOM elements
let tpMatchedIndex = 0; // how far we've matched
let tpLastSpokenLen = 0; // track how many spoken words we already processed
let tpAutoInterval = null; // auto-read interval
let tpAutoPlaying = false;
let tpSpeed = 140; // WPM

const tpPlayBtn = document.getElementById('tpPlayBtn');
const tpPauseBtn = document.getElementById('tpPauseBtn');
const tpResetBtn = document.getElementById('tpResetBtn');
const tpSpeedSlider = document.getElementById('tpSpeed');
const tpSpeedLabel = document.getElementById('tpSpeedLabel');

function showTeleprompterEmptyState() {
    stopTpAuto();
    tpWords = [];
    tpElements = [];
    tpMatchedIndex = 0;
    tpLastSpokenLen = 0;
    if (teleprompterBox) {
        teleprompterBox.innerHTML = '';
        teleprompterBox.style.display = 'none';
    }
    if (teleprompterEmpty) {
        teleprompterEmpty.style.display = 'block';
    }
    if (teleprompterProgress) {
        teleprompterProgress.textContent = '0 / 0';
    }
}

function hideTeleprompterEmptyState() {
    if (teleprompterEmpty) {
        teleprompterEmpty.style.display = 'none';
    }
    if (teleprompterBox) {
        teleprompterBox.style.display = 'block';
    }
}

function initTeleprompter(text) {
    hideTeleprompterEmptyState();

    // Split script into words, preserving line breaks as <br>
    const lines = text.split('\n');
    teleprompterBox.innerHTML = '';
    tpWords = [];
    tpElements = [];
    tpMatchedIndex = 0;
    tpLastSpokenLen = 0;

    lines.forEach((line, li) => {
        const words = line.trim().split(/\s+/).filter(Boolean);
        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'tp-word upcoming';
            span.textContent = word + ' ';
            teleprompterBox.appendChild(span);
            tpWords.push(word.toLowerCase().replace(/[^a-z0-9']/g, ''));
            tpElements.push(span);
        });
        if (li < lines.length - 1) {
            teleprompterBox.appendChild(document.createElement('br'));
        }
    });

    teleprompterContainer.style.display = 'block';
    updateTeleprompterProgress();
}

function updateTeleprompterProgress() {
    if (teleprompterProgress) {
        teleprompterProgress.textContent = `${tpMatchedIndex} / ${tpWords.length}`;
    }
}

// Short/common words that should not trigger a match on their own
const TP_SKIP_WORDS = new Set([
    'a', 'an', 'the', 'i', 'is', 'am', 'are', 'was', 'were', 'be',
    'to', 'of', 'in', 'on', 'at', 'by', 'or', 'it', 'do', 'no',
    'my', 'me', 'we', 'he', 'so', 'if', 'up', 'as', 'and', 'but',
    'for', 'not', 'you', 'all', 'can', 'had', 'her', 'his', 'has',
    'with', 'that', 'this', 'have', 'from', 'they', 'been', 'will',
]);

function advanceTeleprompter(spokenText) {
    if (tpWords.length === 0 || tpMatchedIndex >= tpWords.length) return;

    const allSpoken = spokenText.toLowerCase().split(/\s+/).filter(Boolean)
        .map(w => w.replace(/[^a-z0-9']/g, '')).filter(Boolean);

    if (allSpoken.length <= tpLastSpokenLen) return; // no new words
    const newWords = allSpoken.slice(tpLastSpokenLen);
    tpLastSpokenLen = allSpoken.length;

    // Process each new spoken word strictly in order
    for (const spoken of newWords) {
        if (tpMatchedIndex >= tpWords.length) break;

        // For short common words, only match if it's the very next expected word
        if (TP_SKIP_WORDS.has(spoken)) {
            if (tpWords[tpMatchedIndex] === spoken) {
                markUpTo(tpMatchedIndex);
                tpMatchedIndex++;
            }
            continue;
        }

        // For substantive words, search a small window ahead (max 5 words)
        const searchEnd = Math.min(tpMatchedIndex + 5, tpWords.length);
        let found = false;
        for (let i = tpMatchedIndex; i < searchEnd; i++) {
            if (tpWords[i] === spoken) {
                // Mark everything up to and including this word
                for (let j = tpMatchedIndex; j <= i; j++) {
                    markUpTo(j);
                }
                tpMatchedIndex = i + 1;
                found = true;

                // Auto-scroll
                tpElements[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                break;
            }
        }
    }

    // Update the "current" highlight
    highlightCurrent();
    updateTeleprompterProgress();
}

function markUpTo(idx) {
    if (idx < tpElements.length) {
        tpElements[idx].className = 'tp-word spoken';
    }
}

function highlightCurrent() {
    // Remove old current highlights
    tpElements.forEach(el => {
        if (el.className === 'tp-word current') el.className = 'tp-word spoken';
    });
    // Highlight the next word to be spoken
    if (tpMatchedIndex < tpElements.length) {
        tpElements[tpMatchedIndex].className = 'tp-word current';
        tpElements[tpMatchedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function resetTeleprompter() {
    stopTpAuto();
    tpMatchedIndex = 0;
    tpLastSpokenLen = 0;
    tpElements.forEach(el => el.className = 'tp-word upcoming');
    if (teleprompterBox) teleprompterBox.scrollTop = 0;
    updateTeleprompterProgress();
}

// ─── Teleprompter Auto-Read ─────────────────────────────
function startTpAuto() {
    if (tpWords.length === 0 || tpAutoPlaying) return;
    tpAutoPlaying = true;
    if (tpPlayBtn) tpPlayBtn.style.display = 'none';
    if (tpPauseBtn) tpPauseBtn.style.display = 'flex';

    const msPerWord = (60 / tpSpeed) * 1000;
    tpAutoInterval = setInterval(() => {
        if (tpMatchedIndex >= tpWords.length) {
            stopTpAuto();
            return;
        }
        // Mark current word as spoken
        tpElements[tpMatchedIndex].className = 'tp-word spoken';
        tpMatchedIndex++;

        // Highlight next word
        if (tpMatchedIndex < tpElements.length) {
            // Remove old current
            tpElements.forEach(el => {
                if (el.className === 'tp-word current') el.className = 'tp-word spoken';
            });
            tpElements[tpMatchedIndex].className = 'tp-word current';
            tpElements[tpMatchedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        updateTeleprompterProgress();
    }, msPerWord);
}

function stopTpAuto() {
    tpAutoPlaying = false;
    if (tpAutoInterval) {
        clearInterval(tpAutoInterval);
        tpAutoInterval = null;
    }
    if (tpPlayBtn) tpPlayBtn.style.display = 'flex';
    if (tpPauseBtn) tpPauseBtn.style.display = 'none';
}

// Teleprompter control event listeners
tpPlayBtn?.addEventListener('click', startTpAuto);
tpPauseBtn?.addEventListener('click', stopTpAuto);
tpResetBtn?.addEventListener('click', () => {
    resetTeleprompter();
    // Re-highlight first word
    if (tpElements.length > 0) {
        tpElements[0].className = 'tp-word current';
    }
});

tpSpeedSlider?.addEventListener('input', () => {
    tpSpeed = parseInt(tpSpeedSlider.value, 10);
    if (tpSpeedLabel) tpSpeedLabel.textContent = tpSpeed + ' WPM';
    // If currently auto-playing, restart with new speed
    if (tpAutoPlaying) {
        stopTpAuto();
        startTpAuto();
    }
});

// ─── State ───────────────────────────────────────────────
let recognition = null;
let isRecording = false;
let startTime = null;
let elapsed = 0;
let timerInterval = null;
let fullTranscript = '';
let scriptText = '';

const FILLER_WORDS = [
    'um', 'uh', 'like', 'you know', 'basically', 'actually',
    'literally', 'so', 'well', 'right', 'i mean', 'kind of',
    'sort of', 'you see',
];

// ─── Init: Check API status ─────────────────────────────
(function checkAPI() {
    fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test', duration: 1 }),
    })
    .then(r => {
        if (r.ok) {
            apiStatus.innerHTML = '<i class="fas fa-circle" style="color:#48bb78"></i><span>Connected</span>';
        } else {
            apiStatus.innerHTML = '<i class="fas fa-circle" style="color:#f5576c"></i><span>Error</span>';
        }
    })
    .catch(() => {
        apiStatus.innerHTML = '<i class="fas fa-circle" style="color:#f5576c"></i><span>Offline</span>';
    });
})();

// ─── Summary Generation ─────────────────────────────────
function generateSummary(text) {
    const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    if (sentences.length === 0) return { opening: '', keyPoints: [], closing: '' };

    // Opening: first sentence
    const opening = sentences[0].substring(0, 100) + (sentences[0].length > 100 ? '...' : '');
    
    // Key points: extract 1-2 middle sentences
    const keyPoints = [];
    const importantWords = ['project', 'developed', 'built', 'created', 'designed', 'improved', 'achieved', 'implemented', 'skills', 'experience', 'worked', 'team', 'result', 'successfully'];
    
    for (let i = 1; i < sentences.length - 1; i++) {
        const sent = sentences[i];
        const hasImportantWord = importantWords.some(word => sent.toLowerCase().includes(word));
        const isGoodLength = sent.length > 20 && sent.length < 200;
        
        if ((hasImportantWord || i === 1) && isGoodLength && keyPoints.length < 2) {
            keyPoints.push(sent.substring(0, 100) + (sent.length > 100 ? '...' : ''));
        }
    }
    
    // Closing: last sentence
    const closing = sentences[sentences.length - 1].substring(0, 100) + (sentences[sentences.length - 1].length > 100 ? '...' : '');
    
    return { opening, keyPoints, closing };
}

// ─── Script Panel ───────────────────────────────────────
if (scriptInput) {
    scriptInput.addEventListener('input', () => {
        const text = scriptInput.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCountEl.textContent = words;
        timeEstimate.textContent = words > 0 ? Math.ceil(words / 140) : 0;
    });
}

if (loadScriptBtn) {
    loadScriptBtn.addEventListener('click', () => {
        if (!scriptInput) {
            console.error('Script input element not found');
            return;
        }
        
        scriptText = scriptInput.value.trim();
        if (!scriptText) {
            alert('Please paste a script first.');
            return;
        }

        if (!scriptAnalysis) {
            console.error('Script analysis element not found');
            return;
        }

        try {
            const words = scriptText.split(/\s+/).filter(Boolean).length;
            const sentences = scriptText.split(/[.!?]+/).filter(Boolean).length;
            const summary = generateSummary(scriptText);
            const analysisContent = scriptAnalysis.querySelector('.analysis-content');
            
            if (!analysisContent) {
                console.error('Analysis content element not found');
                return;
            }

            let summaryHTML = '';
            if (summary.opening) {
                summaryHTML += `
                    <div style="margin-top: 15px; padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 8px; border-left: 3px solid #667eea;">
                        <p style="color: #667eea; font-weight: 600; margin-bottom: 8px; font-size: 0.9rem;"><i class="fas fa-lightbulb"></i> Summary</p>
                        <p style="margin: 6px 0; font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);"><strong>Opening:</strong> ${summary.opening}</p>
                        ${summary.keyPoints.map(point => `<p style="margin: 6px 0; font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);"><strong>Key Point:</strong> ${point}</p>`).join('')}
                        <p style="margin: 6px 0; font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);"><strong>Closing:</strong> ${summary.closing}</p>
                    </div>
                `;
            }

            analysisContent.innerHTML = `
                <p><strong>Words:</strong> ${words}</p>
                <p><strong>Est. Duration:</strong> ~${Math.ceil(words / 140)} min at 140 WPM</p>
                <p><strong>Sentences:</strong> ${sentences}</p>
                ${summaryHTML}
                <p style="margin-top:10px; color:#48bb78;"><i class="fas fa-check-circle"></i> Script loaded! Start practicing.</p>
            `;
            scriptAnalysis.style.display = 'block';

            // Pre-load teleprompter preview
            if (scriptText) {
                initTeleprompter(scriptText);
            }
        } catch (err) {
            console.error('Error analyzing script:', err);
            alert('Error analyzing script. Please check the console for details.');
        }
    });
}

// ─── File Import Handlers ────────────────────────────────
function updateScriptStats(text) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCountEl.textContent = words;
    timeEstimate.textContent = words > 0 ? Math.ceil(words / 140) : 0;
}

// TXT & Code files — read client-side
function handleTextFile(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        scriptInput.value = e.target.result;
        updateScriptStats(e.target.result);
        scriptText = e.target.result.trim();
        if (scriptText) initTeleprompter(scriptText);
    };
    reader.readAsText(file);
    input.value = '';
}

document.getElementById('importTxt')?.addEventListener('change', function() { handleTextFile(this); });
document.getElementById('importCode')?.addEventListener('change', function() { handleTextFile(this); });

// PDF & DOC files — upload to server for parsing
function handleServerFile(input) {
    const file = input.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const btn = input.closest('.import-btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

    fetch('/import-file', { method: 'POST', body: formData })
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                alert('Import error: ' + data.error);
            } else {
                scriptInput.value = data.text;
                updateScriptStats(data.text);
                scriptText = data.text.trim();
                if (scriptText) initTeleprompter(scriptText);
            }
        })
        .catch(() => alert('Failed to import file. Please try again.'))
        .finally(() => {
            btn.innerHTML = originalHTML;
            input.value = '';
        });
}

document.getElementById('importPdf')?.addEventListener('change', function() { handleServerFile(this); });
document.getElementById('importDoc')?.addEventListener('change', function() { handleServerFile(this); });
document.getElementById('importPpt')?.addEventListener('change', function() { handleServerFile(this); });

if (clearScriptBtn) {
    clearScriptBtn.addEventListener('click', () => {
        scriptInput.value = '';
        wordCountEl.textContent = '0';
        timeEstimate.textContent = '0';
        scriptAnalysis.style.display = 'none';
        scriptText = '';
        teleprompterContainer.style.display = 'none';
        teleprompterBox.innerHTML = '';
        tpWords = [];
        tpElements = [];
        tpMatchedIndex = 0;
    });
}

// ─── Audio Level Visualization ──────────────────────────
let audioContext = null;
let analyserNode = null;
let micStream = null;
let levelAnimFrame = null;
const micLevelCanvas = document.getElementById('micLevelCanvas');
const micFeedback = document.getElementById('micFeedback');
const micFeedbackText = micFeedback?.querySelector('.mic-feedback-text');

function setMicFeedback(text, type) {
    if (!micFeedbackText) return;
    micFeedbackText.textContent = text;
    micFeedbackText.className = 'mic-feedback-text' + (type ? ' ' + type : '');
}

async function startAudioLevel() {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            }
        });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(micStream);
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 256;
        analyserNode.smoothingTimeConstant = 0.8;
        source.connect(analyserNode);
        drawMicLevel();
    } catch (err) {
        console.warn('Mic level visualizer unavailable:', err);
    }
}

function drawMicLevel() {
    if (!analyserNode || !micLevelCanvas) return;
    const ctx = micLevelCanvas.getContext('2d');
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const W = micLevelCanvas.width;
    const H = micLevelCanvas.height;

    function draw() {
        levelAnimFrame = requestAnimationFrame(draw);
        analyserNode.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const avg = sum / bufferLength;
        const level = Math.min(1, avg / 128);

        ctx.clearRect(0, 0, W, H);

        // Draw horizontal waveform bars (equalizer style)
        const barCount = 40;
        const barWidth = W / barCount;
        const centerY = H / 2;

        // Draw gradient background for bars
        const gradient = ctx.createLinearGradient(0, 0, W, 0);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.10)');
        gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.22)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.10)');

        for (let i = 0; i < barCount; i++) {
            // Get frequency data for this bar
            const index = Math.floor((i / barCount) * bufferLength);
            const barHeight = (dataArray[index] / 255) * (H * 0.7);
            
            const x = i * barWidth + barWidth * 0.1;
            const y = centerY - barHeight / 2;
            const width = barWidth * 0.8;

            // Color intensity based on bar height
            const hue = 196; // Cyan-blue
            const saturation = 80 + (barHeight / (H * 0.7)) * 20;
            const lightness = 40 + (barHeight / (H * 0.7)) * 20;
            const alpha = 0.5 + (barHeight / (H * 0.7)) * 0.5;

            ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
            ctx.fillRect(x, y, width, barHeight);

            // Add glow effect on high bars
            if (barHeight > H * 0.4) {
                ctx.shadowColor = `rgba(56, 189, 248, ${alpha})`;
                ctx.shadowBlur = 10;
                ctx.fillStyle = `hsla(${hue}, ${saturation + 10}%, ${lightness + 10}%, ${alpha * 0.6})`;
                ctx.fillRect(x - 2, y - 2, width + 4, barHeight + 4);
                ctx.shadowBlur = 0;
            }
        }

        // Draw center waveform line
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        for (let i = 0; i < barCount; i++) {
            const index = Math.floor((i / barCount) * bufferLength);
            const barHeight = (dataArray[index] / 255) * (H * 0.7);
            const x = i * barWidth + barWidth / 2;
            const y = centerY - barHeight / 2;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Update feedback based on level
        if (isRecording) {
            if (level < 0.02) {
                setMicFeedback('No audio detected — speak louder or check mic', 'warning');
            } else if (level < 0.08) {
                setMicFeedback('Listening... speak clearly', 'listening');
            } else {
                setMicFeedback('Listening — great volume!', 'listening');
            }
        }
    }
    draw();
}

function stopAudioLevel() {
    if (levelAnimFrame) cancelAnimationFrame(levelAnimFrame);
    levelAnimFrame = null;
    if (micStream) {
        micStream.getTracks().forEach(t => t.stop());
        micStream = null;
    }
    if (audioContext) {
        audioContext.close().catch(() => {});
        audioContext = null;
        analyserNode = null;
    }
    if (micLevelCanvas) {
        const ctx = micLevelCanvas.getContext('2d');
        ctx.clearRect(0, 0, micLevelCanvas.width, micLevelCanvas.height);
    }
}

// ─── Speech Recognition ─────────────────────────────────
const MIN_CONFIDENCE = 0.0; // Captures all speech, avoids dropping accurate words with low confidence scores

function initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
        return null;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'en-US';
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence;

            if (result.isFinal) {
                // Only accept final results above confidence threshold
                if (confidence >= MIN_CONFIDENCE) {
                    finalTranscript += transcript + ' ';
                }
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript) {
            fullTranscript += finalTranscript;
        }

        const combined = fullTranscript + interimTranscript;
        renderTranscript(combined);
        updateLiveMetrics(combined);
        advanceTeleprompter(combined);
    };

    recog.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
            setMicFeedback('No speech detected — try speaking louder', 'warning');
            return;
        }
        if (event.error === 'audio-capture') {
            setMicFeedback('Microphone not found — check your device', 'error');
            return;
        }
        if (event.error === 'not-allowed') {
            setMicFeedback('Mic access denied — allow mic in browser settings', 'error');
            return;
        }
        stopSession();
    };

    recog.onend = () => {
        if (isRecording) {
            recog.start();
        }
    };

    return recog;
}

// ─── Transcript Rendering ───────────────────────────────
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderTranscript(text) {
    if (!text.trim()) {
        transcriptBox.innerHTML = '<p class="placeholder">Click the mic and start speaking...</p>';
        return;
    }

    let html = text;
    FILLER_WORDS.forEach(filler => {
        const regex = new RegExp(`\\b(${escapeRegex(filler)})\\b`, 'gi');
        html = html.replace(regex, '<span class="filler">$1</span>');
    });

    transcriptBox.innerHTML = `<p>${html}</p>`;
    transcriptBox.scrollTop = transcriptBox.scrollHeight;
}

// ─── Live Metrics ───────────────────────────────────────
function countFillers(text) {
    let count = 0;
    const lower = text.toLowerCase();
    FILLER_WORDS.forEach(filler => {
        const regex = new RegExp(`\\b${escapeRegex(filler)}\\b`, 'gi');
        const matches = lower.match(regex);
        if (matches) count += matches.length;
    });
    return count;
}

function updateLiveMetrics(text) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCt = words.length;
    const elapsedSec = (Date.now() - startTime) / 1000;
    
    let wpm = 0;
    if (elapsedSec > 3) {
        wpm = Math.round((wordCt / elapsedSec) * 60);
    } else if (elapsedSec > 0) {
        // Prevent extreme WPM spikes during the first 3 seconds
        wpm = Math.min(150, Math.round((wordCt / Math.max(1, elapsedSec)) * 60));
    }
    
    const fillers = countFillers(text);

    // Animated WPM counter + color coding
    animateValue(wpmValue, wpm, 300);
    const wpmClass = getWpmClass(wpm);
    wpmValue.className = 'value ' + wpmClass;

    // Update circular pace gauge
    const paceGaugeFill = document.getElementById('paceGaugeFill');
    const pacePercent = Math.min(100, (wpm / 200) * 100);
    updateGauge(paceGaugeFill, pacePercent, wpmClass);

    // Pace bar
    paceBar.style.width = pacePercent + '%';
    if (wpm >= 100 && wpm <= 160) {
        paceBar.style.background = 'var(--success)';
    } else if (wpm > 160 && wpm <= 180) {
        paceBar.style.background = 'var(--warning)';
    } else {
        paceBar.style.background = 'var(--danger)';
    }

    // Animated filler counter + color coding
    animateValue(fillerValue, fillers, 300);
    const fillerClass = getFillerClass(fillers);
    fillerValue.className = 'metric-value ' + fillerClass;
    fillerCountEl.textContent = fillers + ' filler' + (fillers !== 1 ? 's' : '');

    // Clarity calculation
    let clarity = 100;
    if (wordCt > 0) {
        clarity = Math.max(0, Math.round(100 - (fillers / wordCt) * 500));
    }
    if (wpm > 180) clarity = Math.max(0, clarity - 15);
    if (wpm > 0 && wpm < 100) clarity = Math.max(0, clarity - 10);

    // Animated clarity + color coding + circular gauge
    animateValue(clarityValue, clarity, 300);
    const clarityClass = getClarityClass(clarity);
    clarityValue.className = 'value ' + clarityClass;

    const clarityGaugeFill = document.getElementById('clarityGaugeFill');
    updateGauge(clarityGaugeFill, clarity, clarityClass);


    // Sparkline: add data point every ~2 seconds
    if (elapsedSec > 0 && Math.floor(elapsedSec) % 2 === 0) {
        if (!updateLiveMetrics._lastSparkSec || Math.floor(elapsedSec) !== updateLiveMetrics._lastSparkSec) {
            updateLiveMetrics._lastSparkSec = Math.floor(elapsedSec);
            addWpmDataPoint(wpm);
        }
    }

    // Script progress
    if (scriptText) {
        const scriptWords = scriptText.split(/\s+/).length;
        const progress = Math.min(100, Math.round((wordCt / scriptWords) * 100));
        progressFill.style.width = progress + '%';
        progressPercent.textContent = progress + '%';
    }

    updateSuggestions(wpm, fillers, wordCt);
}

function updateSuggestions(wpm, fillers, wordCt) {
    const tips = [];
    if (wpm > 170) tips.push('Slow down — aim for ~140 words per minute.');
    else if (wpm > 0 && wpm < 100) tips.push('Try speaking a bit faster — aim for 120-150 WPM.');
    if (fillers > 5) tips.push(`${fillers} filler words detected — try pausing instead.`);
    else if (fillers > 2) tips.push(`${fillers} filler words — work on reducing them.`);
    if (wordCt > 10 && fillers === 0) tips.push('Great job — no filler words so far!');
    if (wpm >= 120 && wpm <= 150 && fillers <= 2) tips.push('Excellent pace and clarity!');
    if (tips.length === 0) tips.push('Start speaking to get feedback');
    suggestionsList.innerHTML = tips.map(t => `<li>${t}</li>`).join('');
}

// ─── Timer ──────────────────────────────────────────────
function updateTimer() {
    elapsed = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsed / 1000);
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
}

// ─── Session Controls ───────────────────────────────────
function startSession() {
    recognition = initRecognition();
    if (!recognition) return;

    fullTranscript = '';
    elapsed = 0;
    isRecording = true;

    recognition.start();
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 200);

    micButton.classList.add('recording');
    micButton.querySelector('.mic-status').textContent = 'Recording...';
    startSessionBtn.disabled = true;
    endSessionBtn.disabled = false;

    transcriptBox.innerHTML = '<p class="placeholder">Listening...</p>';
    setMicFeedback('Initializing microphone...', 'listening');

    // Start audio level visualizer
    startAudioLevel();

    // Activate teleprompter if script is loaded
    if (scriptText) {
        initTeleprompter(scriptText);
    }

    wpmValue.textContent = '0';
    fillerValue.textContent = '0';
    clarityValue.textContent = '-';
    fillerCountEl.textContent = '0 fillers';
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
    suggestionsList.innerHTML = '<li>Start speaking to get feedback</li>';
    // Reset gauges
    const pgf = document.getElementById('paceGaugeFill');
    const cgf = document.getElementById('clarityGaugeFill');
    if (pgf) pgf.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
    if (cgf) cgf.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
    // Reset sparkline
    wpmHistory.length = 0;
    updateLiveMetrics._lastSparkSec = null;
    if (sparklineCanvas) {
        const sctx = sparklineCanvas.getContext('2d');
        sctx.clearRect(0, 0, sparklineCanvas.width, sparklineCanvas.height);
    }
    wpmValue.className = 'value';
    clarityValue.className = 'value';
    fillerValue.className = 'metric-value';
}

function stopSession() {
    if (!isRecording) return;

    isRecording = false;

    if (recognition) {
        recognition.stop();
        recognition = null;
    }

    clearInterval(timerInterval);

    micButton.classList.remove('recording');
    micButton.querySelector('.mic-status').textContent = 'Start Speaking';
    startSessionBtn.disabled = false;
    endSessionBtn.disabled = true;

    setMicFeedback('Session ended', '');
    stopAudioLevel();

    resetTeleprompter();

    sendForAnalysis();
}

// ─── Backend Analysis ───────────────────────────────────
async function sendForAnalysis() {
    const durationSec = Math.floor(elapsed / 1000);

    if (!fullTranscript.trim()) return;

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: fullTranscript,
                duration: durationSec,
            }),
        });

        if (!response.ok) {
            console.error('Analysis API error:', response.status);
            showFinalAnalysis(generateLocalFeedback(durationSec));
            return;
        }

        const data = await response.json();
        showFinalAnalysis(data);
    } catch (err) {
        console.error('Failed to reach server, using local analysis:', err);
        showFinalAnalysis(generateLocalFeedback(durationSec));
    }
}

// ─── Local Feedback Fallback ────────────────────────────
function generateLocalFeedback(durationSec) {
    const words = fullTranscript.trim().split(/\s+/).filter(Boolean);
    const wordCt = words.length;
    const wpm = durationSec > 0 ? Math.round((wordCt / durationSec) * 60) : 0;

    let fillerCount = 0;
    const fillerDetails = {};
    const lower = fullTranscript.toLowerCase();
    FILLER_WORDS.forEach(filler => {
        const regex = new RegExp(`\\b${escapeRegex(filler)}\\b`, 'gi');
        const matches = lower.match(regex);
        if (matches) {
            fillerDetails[filler] = matches.length;
            fillerCount += matches.length;
        }
    });

    let clarity = 100;
    if (wordCt > 0) {
        clarity = Math.max(0, Math.round(100 - (fillerCount / wordCt) * 500));
    }
    if (wpm > 180) clarity = Math.max(0, clarity - 15);
    if (wpm < 100 && wpm > 0) clarity = Math.max(0, clarity - 10);

    let pace = 'N/A';
    if (wpm > 170) pace = 'Too Fast';
    else if (wpm > 150) pace = 'Slightly Fast';
    else if (wpm >= 100) pace = 'Good';
    else if (wpm > 0) pace = 'Too Slow';

    const suggestions = [];
    if (wpm > 170) suggestions.push('Slow down — aim for ~140 WPM.');
    if (wpm > 0 && wpm < 100) suggestions.push('Speed up — aim for 120–150 WPM.');
    if (fillerCount > 3) suggestions.push(`You used ${fillerCount} filler words. Try pausing instead.`);
    if (fillerCount === 0 && wordCt > 10) suggestions.push('Great job avoiding filler words!');
    if (durationSec < 30 && wordCt > 0) suggestions.push('Practice longer for better feedback.');
    if (clarity >= 90 && wordCt > 10) suggestions.push('Excellent clarity!');
    if (suggestions.length === 0) suggestions.push('Keep practicing!');

    return {
        wpm,
        filler_count: fillerCount,
        filler_details: fillerDetails,
        word_count: wordCt,
        clarity,
        pace,
        duration: durationSec,
        suggestions,
    };
}

// ─── Final Analysis Modal ───────────────────────────────
function showFinalAnalysis(data) {
    animateValue(wpmValue, data.wpm, 500);
    animateValue(fillerValue, data.filler_count, 500);
    animateValue(clarityValue, data.clarity, 500);

    // Update gauge colors in final state
    const wpmCls = getWpmClass(data.wpm);
    const clarityCls = getClarityClass(data.clarity);
    wpmValue.className = 'value ' + wpmCls;
    clarityValue.className = 'value ' + clarityCls;
    fillerValue.className = 'metric-value ' + getFillerClass(data.filler_count);

    const paceGaugeFill = document.getElementById('paceGaugeFill');
    const clarityGaugeFill = document.getElementById('clarityGaugeFill');
    updateGauge(paceGaugeFill, Math.min(100, (data.wpm / 200) * 100), wpmCls);
    updateGauge(clarityGaugeFill, data.clarity, clarityCls);

    const dur = data.duration || 0;
    const durStr = dur >= 60
        ? `${Math.floor(dur / 60)}m ${Math.round(dur % 60)}s`
        : `${Math.round(dur)}s`;

    const wpmColor = getMetricColor(wpmCls);
    const clarityColor = getMetricColor(clarityCls);

    analysisSummary.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:15px; text-align:center;">
            <div>
                <div style="font-size:2rem; font-weight:700; color:${wpmColor};">${data.wpm}</div>
                <div style="color:rgba(255,255,255,0.5); font-size:0.9rem;">Words/Min</div>
            </div>
            <div>
                <div style="font-size:2rem; font-weight:700; color:${clarityColor};">${data.clarity}%</div>
                <div style="color:rgba(255,255,255,0.5); font-size:0.9rem;">Clarity</div>
            </div>
            <div>
                <div style="font-size:2rem; font-weight:700; color:var(--primary);">${durStr}</div>
                <div style="color:rgba(255,255,255,0.5); font-size:0.9rem;">Duration</div>
            </div>
        </div>
        <p style="margin-top:15px; text-align:center; color:rgba(255,255,255,0.5);">
            Pace: <strong style="color:var(--light);">${data.pace}</strong> &nbsp;|&nbsp;
            Words: <strong style="color:var(--light);">${data.word_count}</strong> &nbsp;|&nbsp;
            Fillers: <strong style="color:var(--light);">${data.filler_count}</strong>
        </p>
    `;

    const strengths = [];
    if (data.wpm >= 120 && data.wpm <= 150) strengths.push('Great speaking pace');
    if (data.clarity >= 80) strengths.push('High clarity score');
    if (data.filler_count <= 2) strengths.push('Minimal filler words');
    if (data.word_count > 50) strengths.push('Good amount of content');
    if (strengths.length === 0) strengths.push('Keep practicing to build strengths!');
    strengthsList.innerHTML = strengths.map(s => `<li>✅ ${s}</li>`).join('');

    const improvements = [];
    if (data.wpm > 170) improvements.push('Reduce speaking speed');
    if (data.wpm > 0 && data.wpm < 100) improvements.push('Increase speaking speed');
    if (data.filler_count > 5) improvements.push('Significantly reduce filler words');
    else if (data.filler_count > 2) improvements.push('Work on reducing filler words');
    if (data.clarity < 70) improvements.push('Improve overall clarity');
    if (improvements.length === 0) improvements.push('Looking good — keep it up!');
    improvementsList.innerHTML = improvements.map(s => `<li>⚠️ ${s}</li>`).join('');

    recommendationsList.innerHTML = data.suggestions.map(s => `<li>💡 ${s}</li>`).join('');

    analysisModal.classList.add('active');
}

// ─── Demo Session Loading ──────────────────────────────
async function loadDemoSession() {
    try {
        const btn = document.getElementById('loadDemoBtn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        btn.disabled = true;

        const response = await fetch('/demo-session');
        if (!response.ok) {
            throw new Error('Failed to load demo session');
        }

        const data = await response.json();
        
        // Stop any active recording first
        if (isRecording) {
            stopSession();
        }

        // Load demo data into display fields
        fullTranscript = data.transcript || '';
        scriptText = data.script || '';

        // Populate the script and transcript panels
        if (scriptInput) scriptInput.value = scriptText;
        if (transcriptBox) {
            transcriptBox.innerHTML = '<p style="color: #667eea; font-weight: 600; margin-bottom: 8px;"><i class="fas fa-star"></i> Demo Transcript (Sample)</p>';
            // Highlight filler words in transcript
            let highlightedTranscript = fullTranscript;
            if (data.filler_details) {
                Object.keys(data.filler_details).forEach(filler => {
                    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
                    highlightedTranscript = highlightedTranscript.replace(regex, `<span style="color: #f5576c; font-weight: 700; background: rgba(245, 87, 108, 0.2);">$&</span>`);
                });
            }
            transcriptBox.innerHTML += highlightedTranscript;
        }

        // Update word count
        if (wordCountEl) wordCountEl.textContent = data.word_count || 0;
        if (timeEstimate) timeEstimate.textContent = Math.ceil((data.duration || 0) / 60);

        // Show demo message
        setMicFeedback('📊 Demo session loaded — sample analysis shown below', 'listening');

        // Display the analysis
        showFinalAnalysis(data);

        btn.innerHTML = originalHTML;
        btn.disabled = false;
    } catch (err) {
        console.error('Error loading demo session:', err);
        alert('Failed to load demo session. Please try again.');
        const btn = document.getElementById('loadDemoBtn');
        btn.innerHTML = '<i class="fas fa-star mr-2"></i> Try Demo';
        btn.disabled = false;
    }
}

// ─── Event Listeners ────────────────────────────────────
micButton.addEventListener('click', () => {
    if (!isRecording) startSession();
    else stopSession();
});

startSessionBtn.addEventListener('click', () => {
    if (!isRecording) startSession();
});

endSessionBtn.addEventListener('click', stopSession);

const loadDemoBtn = document.getElementById('loadDemoBtn');
if (loadDemoBtn) {
    loadDemoBtn.addEventListener('click', loadDemoSession);
}

closeModalBtn.addEventListener('click', () => {
    analysisModal.classList.remove('active');
});

newSessionBtn.addEventListener('click', () => {
    analysisModal.classList.remove('active');
    transcriptBox.innerHTML = '<p class="placeholder">Click the mic and start speaking...</p>';
    timerEl.textContent = '00:00';
    wpmValue.textContent = '0';
    fillerValue.textContent = '0';
    clarityValue.textContent = '-';
    fillerCountEl.textContent = '0 fillers';
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
    suggestionsList.innerHTML = '<li>Start speaking to get feedback</li>';
    // Reset gauges
    const paceGaugeFill = document.getElementById('paceGaugeFill');
    const clarityGaugeFill = document.getElementById('clarityGaugeFill');
    if (paceGaugeFill) paceGaugeFill.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
    if (clarityGaugeFill) clarityGaugeFill.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
    // Reset sparkline
    wpmHistory.length = 0;
    if (sparklineCanvas) {
        const ctx = sparklineCanvas.getContext('2d');
        ctx.clearRect(0, 0, sparklineCanvas.width, sparklineCanvas.height);
    }
    // Reset color classes
    wpmValue.className = 'value';
    clarityValue.className = 'value';
    fillerValue.className = 'metric-value';
});

// Minimize script panel toggle
const minimizeScript = document.getElementById('minimizeScript');
const scriptEditor = document.querySelector('.script-editor');
if (minimizeScript && scriptEditor) {
    minimizeScript.addEventListener('click', () => {
        const isHidden = scriptEditor.style.display === 'none';
        scriptEditor.style.display = isHidden ? 'block' : 'none';
        minimizeScript.innerHTML = isHidden ? '<i class="fas fa-minus"></i>' : '<i class="fas fa-plus"></i>';
    });
}

// Minimize analytics panel toggle
const minimizeAnalytics = document.getElementById('minimizeAnalytics');
const analyticsContent = document.querySelector('.analytics-content');
const analyticsPanel = document.getElementById('analyticsPanel');
if (minimizeAnalytics && analyticsContent && analyticsPanel) {
    minimizeAnalytics.addEventListener('click', () => {
        const isHidden = analyticsContent.style.display === 'none';
        analyticsContent.style.display = isHidden ? 'flex' : 'none'; // Reverting to flex (or grid in media queries)
        minimizeAnalytics.innerHTML = isHidden ? '<i class="fas fa-minus"></i>' : '<i class="fas fa-plus"></i>';
        
        // Also adjust the panel width/flex if we want it to literally shrink out of the way
        if (!isHidden) {
            analyticsPanel.style.flex = '0 0 auto';
            analyticsPanel.style.minWidth = '200px';
        } else {
            analyticsPanel.style.flex = '';
            analyticsPanel.style.minWidth = '';
        }
    });
}

// Practice Mode Tabs
const modeTabs = document.querySelectorAll('.mode-tab');
const micWrapper = document.querySelector('.mic-wrapper');
const practiceArea = document.querySelector('.practice-area');
const transcriptContainer = document.querySelector('.transcript-container');
const promptContainer = document.getElementById('promptContainer');
const progressContainer = document.querySelector('.progress-container');

if (modeTabs.length > 0 && teleprompterContainer && transcriptContainer) {
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            modeTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');
            
            const mode = tab.dataset.mode;
            if (mode === 'teleprompter') {
                if (practiceArea) practiceArea.classList.add('teleprompter-mode');
                if (micWrapper) micWrapper.style.display = 'none';
                if (micFeedback) micFeedback.style.display = 'none';
                transcriptContainer.style.display = 'none';
                if (promptContainer) promptContainer.style.display = 'none';
                if (progressContainer) progressContainer.style.display = 'none';
                if (scriptText) {
                    teleprompterContainer.style.display = 'block';
                    hideTeleprompterEmptyState();
                } else {
                    teleprompterContainer.style.display = 'block';
                    showTeleprompterEmptyState();
                }
            } else {
                if (practiceArea) practiceArea.classList.remove('teleprompter-mode');
                if (micWrapper) micWrapper.style.display = 'flex';
                if (micFeedback) micFeedback.style.display = 'block';
                transcriptContainer.style.display = 'block';
                teleprompterContainer.style.display = 'none';
                if (promptContainer) promptContainer.style.display = 'block';
                if (progressContainer) progressContainer.style.display = 'block';
            }
        });
    });
}

// ============================================================
// CHATBOT — AI Coach with Robot Mascot
// ============================================================
(function initChatbot() {
    const chatBubble = document.getElementById('chatBubble');
    const chatBubbleBtn = document.getElementById('chatBubbleBtn');
    const chatPanel = document.getElementById('chatPanel');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatClearBtn = document.getElementById('chatClearBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatBadge = document.getElementById('chatBadge');

    if (!chatPanel || !chatBubbleBtn) return;

    let chatHistory = [];
    let chatOpen = false;

    // Greeting
    const GREETING = "Hello! I'm your CampusSpeak AI coach. I can help you with speaking tips, presentation structure, body language advice, and more. What would you like to work on?";

    function toggleChat() {
        chatOpen = !chatOpen;
        if (chatOpen) {
            chatPanel.classList.add('open');
            chatBubble.style.animation = 'none';
            chatBadge.style.display = 'none';
            chatInput.focus();
            if (chatMessages.children.length === 0) {
                addBotMessage(GREETING);
            }
        } else {
            chatPanel.classList.remove('open');
            chatBubble.style.animation = 'bubbleBounce 3s ease-in-out infinite';
        }
    }

    chatBubbleBtn.addEventListener('click', toggleChat);
    chatCloseBtn.addEventListener('click', toggleChat);

    chatClearBtn.addEventListener('click', () => {
        chatHistory = [];
        chatMessages.innerHTML = '';
        addBotMessage(GREETING);
    });

    function addBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg bot';
        msg.innerHTML = `
            <div class="chat-msg-avatar"><i class="fas fa-robot"></i></div>
            <div class="chat-msg-bubble">${escapeHtml(text)}</div>
        `;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatHistory.push({ role: 'assistant', content: text });
    }

    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg user';
        msg.innerHTML = `
            <div class="chat-msg-avatar"><i class="fas fa-user"></i></div>
            <div class="chat-msg-bubble">${escapeHtml(text)}</div>
        `;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatHistory.push({ role: 'user', content: text });
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg bot';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="chat-msg-avatar"><i class="fas fa-robot"></i></div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function getCurrentMetrics() {
        return {
            wpm: parseInt(wpmValue?.textContent) || 0,
            clarity: parseInt(clarityValue?.textContent) || 0,
            fillers: parseInt(fillerValue?.textContent) || 0,
            isRecording: isRecording,
        };
    }

    async function sendChatMessage(text) {
        if (!text.trim()) return;
        addUserMessage(text);
        chatInput.value = '';
        showTyping();

        try {
            const metrics = getCurrentMetrics();
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    context: metrics,
                    history: chatHistory.slice(-10), // last 10 messages for context
                }),
            });

            removeTyping();

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                addBotMessage(err.error || 'Sorry, I encountered an error. Please try again.');
                return;
            }

            const data = await response.json();
            addBotMessage(data.reply);
        } catch (err) {
            removeTyping();
            addBotMessage("I'm having trouble connecting. Please check your connection and try again.");
        }
    }

    chatSendBtn.addEventListener('click', () => sendChatMessage(chatInput.value));
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage(chatInput.value);
        }
    });

    // Show badge after 3 seconds if chat not opened
    setTimeout(() => {
        if (!chatOpen) {
            chatBadge.style.display = 'flex';
        }
    }, 3000);
})();

// ============================================================
// CURSOR-FOLLOWING GLOW EFFECT (Gravity Hover Background)
// ============================================================
(function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursorGlow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        const easing = 0.08;
        glowX += (mouseX - glowX) * easing;
        glowY += (mouseY - glowY) * easing;
        cursorGlow.style.left = glowX - 200 + 'px';
        cursorGlow.style.top  = glowY - 200 + 'px';
        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '0.7'; });
})();

// ============================================================
// PLACEMENT PREPARATION MODE
// ============================================================
(function initPlacementMode() {
    const placementBtns = document.querySelectorAll('.placement-btn');
    if (!placementBtns.length) return;

    placementBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.dataset.prompt;
            const mode   = btn.dataset.mode;

            // Highlight active button
            placementBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Load the template into the script input
            if (scriptInput) {
                scriptInput.value = prompt;
                // Fire input event to update word count
                scriptInput.dispatchEvent(new Event('input'));
            }

            // Store mode globally so it can be sent with save-session
            window._currentPracticeMode = mode;

            // Set the teleprompter automatically
            scriptText = prompt;
            initTeleprompter(prompt);

            // Show a quick visual cue
            const bar = document.getElementById('audienceSimBar');
            if (bar) {
                bar.style.transition = 'box-shadow 0.3s';
            }

            // Scroll to practice area
            const practicePanel = document.querySelector('.practice-area');
            if (practicePanel) {
                practicePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

// ============================================================
// AUDIENCE SIMULATION (Crowd Noise using Web Audio API)
// ============================================================
(function initAudienceSim() {
    let audioCtx = null;
    let noiseNode = null;
    let gainNode  = null;
    let filterNode = null;
    let isSimActive = false;

    const toggle = document.getElementById('audienceSimToggle');
    const bar    = document.getElementById('audienceSimBar');
    if (!toggle) return;

    function createCrowdNoise(ctx) {
        // White noise buffer
        const bufferSize = ctx.sampleRate * 3; // 3 second loopable buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data   = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop   = true;
        return source;
    }

    function startNoise() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();

        noiseNode  = createCrowdNoise(audioCtx);
        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'bandpass';
        filterNode.frequency.value = 600;   // Murmur frequency
        filterNode.Q.value = 0.5;

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1.5); // Fade in

        noiseNode.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noiseNode.start();
        isSimActive = true;

        if (bar) bar.classList.add('active');
    }

    function stopNoise() {
        if (!gainNode || !audioCtx) return;
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8); // Fade out
        setTimeout(() => {
            try { noiseNode && noiseNode.stop(); } catch(e) {}
            noiseNode = null;
        }, 900);
        isSimActive = false;
        if (bar) bar.classList.remove('active');
    }

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            startNoise();
        } else {
            stopNoise();
        }
    });

    // Expose so stopSession can stop it
    window._stopAudienceSim = stopNoise;
    window._isAudienceSimActive = () => isSimActive;
})();

// ============================================================
// CONFIDENCE SCORE + PERSONALITY IN MODAL
// ============================================================
// Patch showFinalAnalysis to also render confidence + personality
const _originalShowFinalAnalysis = showFinalAnalysis;
function showFinalAnalysis(data) {
    // Call original function
    _originalShowFinalAnalysis(data);

    // ── Confidence ring in modal ──────────────────────────────
    const confScore = data.confidence_score ?? 0;
    const personalityType = data.personality_type ?? '—';
    const improvArea = data.improvement_area ?? '—';

    const ring = document.getElementById('modalConfRing');
    const scoreEl = document.getElementById('modalConfScore');
    const typeEl  = document.getElementById('modalPersonalityType');
    const areaEl  = document.getElementById('modalImprovArea');

    if (ring) {
        const circumference = 2 * Math.PI * 34; // r=34 → 213.6
        const offset = circumference * (1 - confScore / 100);
        ring.style.strokeDashoffset = offset;

        // Color based on score
        if (confScore >= 75) ring.style.stroke = '#10b981';
        else if (confScore >= 50) ring.style.stroke = '#f59e0b';
        else ring.style.stroke = '#ef4444';
    }
    if (scoreEl) {
        scoreEl.textContent = confScore + '%';
        if (confScore >= 75) scoreEl.style.color = '#10b981';
        else if (confScore >= 50) scoreEl.style.color = '#f59e0b';
        else scoreEl.style.color = '#ef4444';
    }
    if (typeEl) typeEl.textContent = personalityType;
    if (areaEl) areaEl.textContent = improvArea;

    // ── Save session to backend ───────────────────────────────
    saveSessionToBackend(data);
}

// ============================================================
// SESSION SAVING
// ============================================================
async function saveSessionToBackend(data) {
    try {
        const mode = window._currentPracticeMode || 'Free Speaking';
        await fetch('/save-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                duration:         data.duration         ?? 0,
                word_count:       data.word_count        ?? 0,
                wpm:              data.wpm               ?? 0,
                filler_count:     data.filler_count      ?? 0,
                clarity:          data.clarity           ?? 0,
                confidence_score: data.confidence_score  ?? 0,
                pace:             data.pace              ?? 'N/A',
                personality_type: data.personality_type  ?? '',
                improvement_area: data.improvement_area  ?? '',
                mode,
            }),
        });
    } catch (e) {
        // Silent fail — saving is non-critical
        console.warn('Session save failed (non-critical):', e);
    }
}

