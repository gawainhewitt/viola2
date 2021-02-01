//document.URL is the current url
var url_ob = new URL(document.URL);

document.getElementById("save").addEventListener("click", saveSeq);

const rows = 3;
      notes = ['C3', 'D3', 'E3'];
let index = 0,
    seqLength = 8;
    seqSteps = new Array ();
seqSteps[0] = new Array (0,0,0,0,0,0,0,0);
seqSteps[1] = new Array (0,0,0,0,0,0,0,0);
seqSteps[2] = new Array (0,0,0,0,0,0,0,0);
var savedWork = url_ob.hash; //retrieve saved work from url
var savedWorkNoHash = savedWork.replace('#', ''); // remove the hash from it leaving only the hex number
var savedSeqAsBinary = (parseInt(savedWorkNoHash, 16).toString(2)); //convert saved work to binary number
var savedSeqAsArray = savedSeqAsBinary.split('');
var totalSteps = rows * seqLength;
var convertedSeqAsArray = new Array ();


for (let i = rows-1; i >= 0; i--) {  // put the saved number into the sequence arrays
    for (let j = seqLength-1; j >= 0; j--) {
        if (savedSeqAsArray.length > 0){
            seqSteps[i][j] = savedSeqAsArray.pop(); //remove last number from array and place in last place
        } else {   //we will likely run out of numbers unless the first step is used
            seqSteps[i][j] = "0"; //in that case place a 0
        }
        let input = document.getElementById(`row${i}step${j}`);
        console.log(input);
        if (seqSteps[i][j] === "1") {
            input.checked = true;
        } else {
            input.checked = false;
        }
    }
}

console.log(seqSteps[0]);
console.log(seqSteps[1]);
console.log(seqSteps[2]);

function saveSeq() {
    let row0 = seqSteps[0].join('');
    let row1 = seqSteps[1].join('');
    let row2 = seqSteps[2].join('');
    let seqAsBinary = `${row0}${row1}${row2}`
    console.log(seqAsBinary);
    let seqAsHex = parseInt(seqAsBinary, 2).toString(16)
    console.log(seqAsHex);
    console.log(parseInt(seqAsHex, 16).toString(2)); //convert back to long binary
    url_ob.hash = `#${seqAsHex}`;
    var new_url = url_ob.href;
    document.location.href = new_url;
}

document.documentElement.addEventListener('mousedown', () => { // user clickj to enable audio
    if (Tone.context.state !== 'running') Tone.context.resume();
  });

const synths = [
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth()
];

const sampler = new Tone.Sampler({
	urls: {
		B2: "horn-tone-b2.mp3",
    C3: "horn-tone-c3.mp3",
    E3: "horn-tone-e3.mp3",
    G3: "horn-tone-g3.mp3",
    A3: "horn-tone-a3.mp3",
    C4: "horn-tone-c4.mp3"
	},
	baseUrl: "/sounds/",
// 	onload: () => {
//     // hideLoadScreen();
//   }
}).toDestination();

synths[0].oscillator.type = 'triangle';
synths[1].oscillator.type = 'sine';
synths[2].oscillator.type = 'sawtooth';

// const gain = new Tone.Gain(0.6);
// gain.toDestination();

// synths.forEach(synth => synth.connect(gain));



Tone.Transport.scheduleRepeat(repeat, '8n'); // call our function 'repeat' every x time (8n or an 8th note in this case)
Tone.Transport.start();

function repeat(time) {
    let step = index % seqLength;

    for (let i = 0; i < rows; i++) {
        let synth = sampler,
            note = notes[i],
            input = document.getElementById(`row${i}step${step}`);
        if (input.checked) {
            synth.triggerAttackRelease(note, '8n', time);
            seqSteps[i][step] = 1;
        } else {
            seqSteps[i][step] = 0;
        }
    }
    index++;
  }
