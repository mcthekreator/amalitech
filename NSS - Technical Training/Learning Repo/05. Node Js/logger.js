
// const url = "http://mylogger.io/log";
// function log(message) {
//   console.log(message);
// }
// // function cal(num2, num3) {
// //   return num2 + num3;
// // }

// module.exports = log;
// module.exports.calu = cal;


const EventEmitter = require('events');

class Logger extends EventEmitter{
    log(message){
        // sned an HTTP request
        console.log(message);

        // Raise an event
        this.emit('messageLogged', {id:1, url: 'http//'})
    }
}
module.exports = Logger;