const fs = require('fs');
let claimedSquares = 0;
fs.readFile('input.txt',(err, fd) => {
    if (err) {
        throw err;
    }
    const grid = {};
    const claims = fd.toString().split('\r\n');

    claims.forEach(claim => {
        const claimNumber = claim.split('@ ')[0].split('#')[1];
        const size = claim.split('@ ')[1].split(': ')[1].split('x');
        const position = claim.split('@ ')[1].split(': ')[0].split(',');
        const xPosition = parseInt(position[0]);
        const yPosition = parseInt(position[1]);
        const width = parseInt(size[0]) + xPosition;
        const height = parseInt(size[1]) + yPosition;
        for (let x = yPosition; x < height; x++) {
            if (grid[x] === undefined) {
                grid[x] = {};
            }
            for (let y = xPosition; y < width; y++) {
                grid[x] = {
                    ...grid[x],
                    [y]: grid[x][y] !== undefined ? [...grid[x][y], claimNumber] : [claimNumber]
                }
            }
        }
    });
    const rows = Object.keys(grid);
    const overlapClaims = {};
    rows.forEach(row => {
        const columns = Object.keys(grid[row]);
        columns.forEach(col => {
            if (grid[row][col].length === 1) {
                const singleClaim = grid[row][col][0];
                if (overlapClaims[singleClaim] === undefined) {
                    overlapClaims[singleClaim] = false;
                }
            } else if (grid[row][col].length > 1) {
                claimedSquares++;
                grid[row][col].forEach(claim => {
                        overlapClaims[claim] = true;
                });
            }
        })
    });
    const singleClaim = claims.filter(claim => overlapClaims[claim.split('@ ')[0].split('#')[1]] === false);
    console.log('Claimed squares:', claimedSquares);
    console.log('Unique claims: ', singleClaim);
});