const fs = require('fs');
let result = 0;
let results = [];
fs.readFile('input.txt',(err, fd) => {
    if (err) {
        throw err;
    }
    const inputs = fd.toString().split('\r\n').map(item => parseInt(item));
    let inputSum = 0;
    inputs.forEach(input => {
        inputSum += input
    });
    const findFirstDouble = (inputArray) => {
        while(true) {
            for (let freqChange of inputArray) {
                result += freqChange;
                if (results.includes(result)) {
                    return result;
                }
                results.push(result);
            };
        }
    }

    console.log('Part 1: ' + inputSum, 'Part 2: ' + findFirstDouble(inputs));
});