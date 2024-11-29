// let logger = require('./logger')

// let num = logger.calu(2,3);

// logger.logg(num)

// loading path
// const path = require('path')
// let jo = path.parse(__filename)
// console.log(jo.ext);

// loading OS

// const os = require('os')
// let totalMemory = os.totalmem()
// let freeMemory = os.freemem();

// console.log(`Total Memory: ${totalMemory} \nfreeMemory: ${freeMemory}`);


// File System Module

// const fs = require('fs');

// Synchronous
// const files = fs.readdirSync('./');
// console.log(files);

// Asynchronous
//  fs.readdir('../../', function(err, files){
//     if(err) console.log('Error', err);
//     else console.log(files);
//  })


// Event Module 
// const EventEmitter = require('events')
// const emitter = new EventEmitter();

// Register a listener
// emitter.on('messageLogged', function(){
//     console.log(('Listerner Called'));
// }) 

// // Raise Event
// emitter.emit('messageLogged');


// Event Agument- Module
// const EventEmitter = require('events')
// const emitter = new EventEmitter();

// // Register a listener
// emitter.on('messageLogged', (arg)=>{
//     console.log(('Listerner Called', arg));
// }) ;

// // Raise Event
// emitter.emit('messageLogged', {id: 1, url: 'http://'});


// Assesment 
// const EventEmitter = require('events')
// const emitter = new EventEmitter();

// emitter.on('Logging', (arg)=>{
//         const log = require('./logger')
//         log.logg(arg)
// })

// emitter.emit('Logging', 'Term')


// Extending Event Emitter

// const Logger = require('./logger')
// const logger = new Logger()
 
// // Register a Listener
// logger.on('messageLogged', (arg)=>{
//     console.log('Listener called', arg);
// })
// logger.log('message')

const http = require('http')

const server = http.createServer((req,res)=>{
    if(req.url === '/'){
        res.write('Hello World')
        res.end();
    }
    if(req.url === '/api/courses'){
        res.write(JSON.stringify([1,2,3,4]))
        res.end()
    }
})

server.listen(3200)
console.log("Listening on port 3000");
 