const textInput = document.getElementById('textInput');
const lineNumbers = document.getElementById('lineNumbers');
const playBtn = document.getElementById('playBtn');
const restartBtn = document.getElementById('restartBtn');

let isPlaying = false;
let isPaused = false;
let linesData = [];
let playTimer = null;
let currentStep = 0;

// === Numeros de ligne ===
function updateLineNumbers() {
    const lines = textInput.value.split('\n');
    lineNumbers.textContent = lines.map((_, i) => i + 1).join('\n');
}
updateLineNumbers();
textInput.addEventListener('input', updateLineNumbers);

// === Parsing ===
function parseLine(line) {
    const parts = line.trim().split(/\s+/);
    const tempo = parseInt(parts[0]) || 120;
    const tokens = parts.slice(1);
    return {tokens, tempo};
}

// === Stop tout ===
function stopAll() {
    if (playTimer) {
        clearInterval(playTimer);
        playTimer = null;
    }
    Tone.Transport.stop();
    Tone.Transport.cancel();
}

// === Un pas de lecture ===
function playStep() {
    let finished = true;
    linesData.forEach(line => {
        if (currentStep < line.tokens.length) {
            const token = line.tokens[currentStep];
            if (token && token !== ' ') {
                playLineTone({tokens:[token], tempo: line.tempo});
            }
            finished = false;
        }
    });
    if (finished) endPlayback();
    else currentStep++;
}

// === Controles ===
function startPlayback() {
    stopAll();
    isPlaying = true;
    isPaused = false;
    playBtn.textContent = '■';
    playBtn.className = 'stop';
    playTimer = setInterval(playStep, 300);
}

function pausePlayback() {
    isPlaying = false;
    isPaused = true;
    playBtn.textContent = '▶';
    playBtn.className = '';
    stopAll();
}

function endPlayback() {
    isPlaying = false;
    isPaused = false;
    currentStep = 0;
    playBtn.textContent = '▶';
    playBtn.className = '';
    stopAll();
}

// === Bouton Play ===
playBtn.addEventListener('click', () => {
    const text = textInput.value.trim().split('\n');
    if (isPlaying) return pausePlayback();
    if (isPaused) {
        isPlaying = true;
        isPaused = false;
        playBtn.textContent = '■';
        playBtn.className = 'stop';
        playTimer = setInterval(playStep, 300);
        return;
    }
    linesData = text.map(parseLine);
    currentStep = 0;
    startPlayback();
});

// === Bouton Restart ===
restartBtn.addEventListener('click', () => {
    const text = textInput.value.trim().split('\n');
    linesData = text.map(parseLine);
    currentStep = 0;
    startPlayback();
});

// === Changement de style ===
document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentOscType = btn.dataset.style;
        synth.oscillator.type = currentOscType; // changer le type en direct
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});
