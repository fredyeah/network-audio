/*
$CONCERTO for network and iMacs 
preface: 
1.) this is a community performance/spatial excersise/network composition 
2.) this piece relys on everyone contributing and being mindful of the sound space they occupy!
3.) there are two types of volume: the computer volume (controlled with keyboard) and the application volume (controlled with volume fader)
4.) I request that you all leave the computer volume as high as possible unless the noise becomes unbearable 
5.) after we begin, you may contribute for as long or as little as you want. 
6.) when you feel that you have contributed all that you want, please slowly turn down the volume fader
instructions for piece: 
1.) please follow these instruction exactly
2.) please turn your computer volume all the way up
3.) go to $MYIPADDRESS:5000
4.) please do not click anything until I tell you that we are beginning 
5.) is there anyone who does not see two knobs and one fader? there should be $NUMBEROFSTUDENTS connections right now 
6.) distribute client pairs from server 
7.) you may begin. I suggest to start by !slowly! turning up the volume fader. 
*/


const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname))

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

var clients = 0;
var ids = [];
class user {
    constructor(socket){
        this.socket = socket; 
        this.pair = null; 
        this.id = socket.id;
    }
    assign(pair){
        this.pair = pair;
    }
}

function distribute() {
    for(var i = 0; i < ids.length; i++){
        ids[i].pair = ids[(i+1) % ids.length];
        ids[i].socket.emit('connected', true);
        //ids[i].socket.emit('distribution', 'you have been distributed and your id is' + ids[i].socket.id + 'and your pair is' + ids[i].pair.socket.id);
    }
}

function sendfreq(freq, socket) {
    for(var i = 0; i < ids.length; i++){
        if(ids[i].socket === socket){
            console.log('updating frequency for ' + ids[i].pair.id);
            ids[i].pair.socket.emit('updatefreq', freq);
        }
    }
}

function senddel(del, socket) {
    for(var i = 0; i < ids.length; i++){
        if(ids[i].socket === socket){
            console.log('updating delay to ' + del + ' for ' + ids[i].pair.id);
            ids[i].pair.socket.emit('updatedel', del);
        }
    }
}

function sendvol(vol, socket) {
    for(var i = 0; i < ids.length; i++){
        if(ids[i].socket === socket){
            console.log('updating volume for ' + ids[i].pair.id);
            ids[i].pair.socket.emit('updatevol', vol);
        }
    }
}

io.on('connection', socket => {
    ids.push(new user(socket));
    clients++;
    socket.emit('broadcast', 'you are the ' + clients + 'client');
    socket.on('hello', message => {
        console.log(message, socket.id);
    })
    socket.on('disconnect', message => {
        clients--;
        console.log(message, clients);
    })
    socket.on('distribute', message => {
        distribute();
    })
    socket.on('freq', freq => {
        sendfreq(freq, socket);
    })
    socket.on('delay', del => {
        senddel(del, socket);
    })
    socket.on('vol', vol => {
        sendvol(vol, socket);
    })
    console.log(clients);
});

http.listen(5000, function() {
    console.log('listening on http://localhost:5000');
});