// web server required packages
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// serial port communication required packages
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

// required packages for serial send/receive
import { Server } from 'socket.io';

// function for parsing received serial data
function parseData(input) {
    // Extract the content between the angle brackets
    const data = input.match(/<([^>]+)>/)[1];
    
    // Split the content by commas
    const values = data.split(',');

    return values;
}

// web server setup
const app = express();
const server = createServer(app);

// serial port comms setup
const parser = new ReadlineParser({
    delimiter: '\r\n'
});
var port = new SerialPort({
    path: '/dev/ttyUSB0',
    baudRate: 115200
});
port.pipe(parser);

// serial capture setup
const io = new Server(server);

// setup index.html to be the main page
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public/index.html'));
});

// make everything else in public available
app.use(express.static('public'));

// add bootstrap
app.use('/css', express.static(join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(join(__dirname, 'node_modules/bootstrap/dist/js')))

// listen for socket connections
io.on('connection', (socket) => {
    // grab submitted form object
    socket.on('trackerData', (msg) => {
        const [key, value] = msg;
        const trackerNumber = key.split("tracker_")[1];
        const trackerData = `<Browser, ${trackerNumber}, 1>`
        console.log(trackerData);
        port.write(trackerData);
    });
});

parser.on('data', data =>{
    console.log('DATA: ' + data);
    if (data.includes("<Receiver")) {
        const parsedValues = parseData(data);
        console.log('DATA: ' + parsedValues);
        const StatusID = parsedValues[2];
        if(StatusID == 0){
            console.log('RECEIVER: WAITING');
        }
        if(StatusID == 1){
            console.log('RECEIVER: STARTED');
        }
        if(StatusID == 2){
            console.log('RECEIVER: PAUSED');
        }
        if(StatusID == 3){
            console.log('RECEIVER: RESUMED');
        }
        if(StatusID == 4){
            console.log('RECEIVER: CANCELLED');
            io.emit('returnTracker', "true");
        }
        if(StatusID == 5){
            console.log('RECEIVER: RUNNING');
        }
        if(StatusID == 6){
            console.log('RECEIVER: UP-NEXT');
        }
    }
});

// start the web server at port 3000
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
