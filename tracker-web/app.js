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
    // grab chat messages and output them to console
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        port.write(msg);
    });
});

// start the web server at port 3000
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});