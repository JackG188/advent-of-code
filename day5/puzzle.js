const fs = require('fs');
fs.readFile('input.txt',(err, fd) => {
    if (err) {
        throw err;
    }
    const isUpperCase = (char) => {
        return (char === char.toUpperCase() && char !== char.toLowerCase());
    }

    const matchingLetter = (letterA, letterB) => {
        if (letterA.toLowerCase() === letterB.toLowerCase()) {
            return (!isUpperCase(letterA) && isUpperCase(letterB) || (isUpperCase(letterA) && !isUpperCase(letterB)))
        }
        return false;
    }

    const compareAndRemove = (letterA, letterB, letters, index) => {
        if (matchingLetter(letterA, letterB)) {
            letters.splice(index, 2);
            index = 0;
        } else {
            index = index + 1;
        }
        return index;
    }
    let polymer = [...fd.toString()];
    let index = 0;
    let polyStack = [];
    //[...'dabAcCaCBAcCcaDA'];
    const scanPolymer = (letters) => {
        letters.forEach(letter => {
            if (polyStack.length === 0) {
                polyStack.push(letter);
            } else if (matchingLetter(polyStack[polyStack.length - 1], letter)) {
                polyStack.pop();
            } else {
                polyStack.push(letter);
            }
        });
    };
    scanPolymer(polymer);
    console.log(polyStack.length);
});