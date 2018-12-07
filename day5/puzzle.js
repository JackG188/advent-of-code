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

    const polymer = [...fd.toString()];
    let polyStack = [];
    //[...'dabAcCaCBAcCcaDA'];
    const scanPolymer = (letters, polyStack) => {
        letters.forEach(letter => {
            if (polyStack.length === 0) {
                polyStack.push(letter);
            } else if (matchingLetter(polyStack[polyStack.length - 1], letter)) {
                polyStack.pop();
            } else {
                polyStack.push(letter);
            }
        });
        return polyStack;
    };
    const result = scanPolymer(polymer, polyStack);
    console.log(result.length);

    // part 2

    const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
    let alphaStore = {};
    alphabet.forEach(letter => {
        const polymerToBeImproved = [...fd.toString()].filter(polyLetter => polyLetter.toLowerCase() !== letter);
        let stack = []
        alphaStore[letter] = scanPolymer(polymerToBeImproved, stack).length;
    });
    const shortestPolymer = Object.keys(alphaStore).reduce((a, b) => alphaStore[a] < alphaStore[b] ? a : b);
    console.log(shortestPolymer, alphaStore[shortestPolymer]);
});