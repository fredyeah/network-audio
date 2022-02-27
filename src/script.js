var rotating = false;
var current; 
var base = 220;
base = base/2; 
base = base/2; 
class note {
  constructor(name, val){
    this.name = name; 
    this.val = val;
  }
}
var notes = [];
for(var i = 1; i < (6); i ++){
  var temp = new note('Bb' + i, base * Math.pow(2, i) * Math.pow(2, 1/12));
  notes.push(temp);
  var temp = new note('B' + i, base * Math.pow(2, i) * Math.pow(2, 2/12));
  notes.push(temp);
  var temp = new note('C' + i, base * Math.pow(2, i) * Math.pow(2, 3/12));
  notes.push(temp);
  var temp = new note('Db' + i, base * Math.pow(2, i) * Math.pow(2, 4/12));
  notes.push(temp);
  var temp = new note('D' + i, base * Math.pow(2, i) * Math.pow(2, 5/12));
  notes.push(temp);
  var temp = new note('Eb' + i, base * Math.pow(2, i) * Math.pow(2, 6/12));
  notes.push(temp);
  var temp = new note('E' + i, base * Math.pow(2, i) * Math.pow(2, 7/12));
  notes.push(temp);
  var temp = new note('F' + i, base * Math.pow(2, i) * Math.pow(2, 8/12));
  notes.push(temp);
  var temp = new note('Gb' + i, base * Math.pow(2, i) * Math.pow(2, 9/12));
  notes.push(temp);
  var temp = new note('G' + i, base * Math.pow(2, i) * Math.pow(2, 10/12));
  notes.push(temp);
  var temp = new note('Ab' + i, base * Math.pow(2, i) * Math.pow(2, 11/12));
  notes.push(temp);
  var temp = new note('A' + i, base * Math.pow(2, i) * Math.pow(2, 12/12));
  notes.push(temp);
}

class osc {
  constructor(ctx, type, freq, vol, dest){
    this.ctx = ctx; 
    this.type = type; 
    this.freq = freq; 
    this.vol = vol;
    this.dest = dest;
    this.osc = null;
    this.gain = null;
  }
  init(){
    this.ctx = new AudioContext();
    this.osc = this.ctx.createOscillator();
    this.osc.type = this.type;
    this.osc.frequency.value = this.freq;
    this.gain = this.ctx.createGain();
    this.gain.gain.value = this.vol;
    this.osc.connect(this.gain);
    this.gain.connect(this.ctx.destination);
  }
  play(){
    this.osc.start();
  }
}

var blue = new osc(null, 'square', 1, 1, null);
blue.init();

var red = new osc(null, 'sine', 1, 1, null);
red.init();

//console.log(blue.ctx.createMediaStreamDestination().stream);

//var stream = new MediaStream(blue.ctx.destination);

//var stream = new AudioContext(); 
//var src = new Audio();
//var sosc = stream.createOscillator(); 
//var live = stream.createMediaStreamDestination();
//sosc.connect(stream.destination);
//var src = new AudioContext();
//src.createMediaStreamSource('https://www.synthui.fredyeah.repl.co');

function play() {
  blue.play();
  red.play();
  //sosc.start();
}

function addMove() {
  document.addEventListener("mousemove", e => {
    if(rotating && (current.type === 'rotary')){
      x = (e.screenY - current.origin) * -1 * current.sens + current.rotation;
      if (x > 330) {x = 330;}
      if (x < 30) {x = 30;}
      current.degs = x;
      var degs = 'rotateZ(' + x + 'deg)';
      current.element.style.transform = degs;
      var dbs = (x - 30) / 6; 
      dbs = dbs.toFixed(0);
      current.dest.osc.frequency.exponentialRampToValueAtTime(notes[dbs].val, current.dest.ctx.currentTime + 0.1);
    }
    if(rotating && (current.type === 'linear')){
      x = (e.screenY - current.origin) * current.sens + current.rotation; 
      if (x < -200) {x = -200;}
      if (x > -20) {x = -20;}
      current.degs = x; 
      var degs = 'translateY(' + x + 'px)';
      current.element.style.transform = degs; 
      var dbs = (x + 20 - 1) * -1 / 180.0;
      current.dest.gain.gain.exponentialRampToValueAtTime(dbs, current.dest.ctx.currentTime + 0.1);
    }
  });
}

function addRelease() {
  document.addEventListener("mouseup", e => {
    rotating = false;
    current.rotation = current.degs;
  });
}

class knob {
  constructor(element, rotation, type, origin, degs, sens, dest) {
    this.element = element; 
    this.rotation = rotation; 
    this.type = type;
    this.origin = origin;
    this.degs = degs;
    this.sens = sens;
    this.dest = dest;
    this.addListen();
    addMove();
    addRelease();
  }
  addListen() {
    this.element.addEventListener("mousedown", e => {
      rotating = true;
      current = this;
      this.origin = e.screenY;
    });
  }
}

var blueK = new knob(document.getElementById('blueknob'), 30, 'rotary');
var redK = new knob(document.getElementById('redknob'), 30, 'rotary');
blueK.sens = 3; 
blueK.dest = blue;
redK.sens = 2;
redK.dest = red;
var bslide = new knob(document.getElementById('blueslider'), -20, 'linear');
var rslide = new knob(document.getElementById('redslider'), -20, 'linear');
bslide.sens = 1;
bslide.dest = blue;
rslide.sens = 1; 
rslide.dest = red;


