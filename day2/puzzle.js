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

    const compareIDs = (box1, box2) => {
        let differences = 0;
        let indexesToRemove = [];
        for (let x = 0; x < box1.length; x ++) {
            if (box1[x] !== box2[x]) {
                differences++;
                indexesToRemove.push(x);
            }
        }
        if (differences === 1) {
            indexesToRemove.forEach(indexToRemove => box1.splice(indexToRemove, 1));
            console.log(box1.toString().replace(/\,/g, ''));
        }
    }

    boxIDs.forEach(box1 => {
        boxIDs.forEach(box2 => {
            compareIDs([...box1], [...box2]);
        })
    })
});