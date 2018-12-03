const fs = require('fs');
let doubles = 0;
let triples = 0;
fs.readFile('input.txt',(err, fd) => {
    if (err) {
        throw err;
    }
    const boxIDs = fd.toString().split('\r\n');
    boxIDs.forEach(boxID => {
        const box = [...boxID];
        let count = {};
        box.forEach(letter => count[letter] !== undefined ? count[letter] = count[letter] + 1 : count[letter] = 1 );
        const letterCountValues = Array.from(new Set(Object.keys(count).map(key => {
            return count[key];
        })));

        letterCountValues.forEach(value => {
            if (value === 3) {
                triples++;
            } else if (value === 2) {
                doubles++;
            }
        })
    });
    console.log(triples, doubles, triples * doubles);
});