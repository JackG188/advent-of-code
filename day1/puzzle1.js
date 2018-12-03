const fs = require('fs');
let result = 0;
fs.readFile('input.txt',(err, fd) => {
    if (err) {
        throw err;
    }
    fd.toString().split('\r\n').map(item => parseInt(item)).forEach(freqChange => {
        result = result + freqChange;
    });
    console.log(result);
});