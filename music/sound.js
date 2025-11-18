// === SONS ===
let currentOscType = 'sawtooth';
let synth = new Tone.Synth({ oscillator: { type: currentOscType } }).toDestination();

const letterToNote = {
    'a':'A3','b':'B3','c':'C4','d':'D4','e':'E4','f':'F4','g':'G4','h':'A4','i':'B4','j':'C5',
    'k':'D5','l':'E5','m':'F5','n':'G5','o':'A5','p':'B5','q':'C6','r':'D6','s':'E6','t':'F6',
    'u':'G6','v':'A6','w':'B6','x':'C7','y':'D7','z':'E7',' ':null
};

const sequenceToNote = {
    'do':'C4','re':'D4','mi':'E4','fa':'F4','sol':'G4','la':'A4','si':'B4'
};

function playLineTone(lineObj) {
    const {tokens, tempo} = lineObj;
    const secondsPerBeat = 60 / tempo;
    let time = Tone.now();
    tokens.forEach(token => {
        if(!token || token === ' ') {
            time += secondsPerBeat;
            return;
        }
        let i = 0;
        while(i < token.length) {
            let matched = false;
            for(let len = 3; len >= 2; len--) {
                const sub = token.substring(i, i+len).toLowerCase();
                if(sequenceToNote[sub]) {
                    synth.triggerAttackRelease(sequenceToNote[sub], secondsPerBeat, time);
                    time += secondsPerBeat;
                    i += len;
                    matched = true;
                    break;
                }
            }
            if(!matched) {
                const char = token[i].toLowerCase();
                if(letterToNote[char]) {
                    synth.triggerAttackRelease(letterToNote[char], secondsPerBeat, time);
                    time += secondsPerBeat;
                }
                i++;
            }
        }
    });
}