const fs = require('fs');
fs.readFile('input.txt',(err, fd) => {
    if (err) {
        throw err;
    }
    
    const coords = [...fd.toString().split('\r\n')].map(coord => {
        const xy = coord.split(', ');
        return {
            x: parseInt(xy[0]),
            y: parseInt(xy[1])
        }
    });

    const manhattanDistance = (x1, x2, y1, y2) => {
        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    }

    const sortedMaxXCoords = coords.sort((a, b) => a.x > b.x ? -1 : 1);
    const maxXCoord = sortedMaxXCoords[0];
    const minXCoord = sortedMaxXCoords[sortedMaxXCoords.length - 1];

    const sortedMaxYCoords = coords.sort((a, b) => a.y > b.y ? -1 : 1);
    const maxYCoord = sortedMaxYCoords[0];
    const minYCoord = sortedMaxYCoords[sortedMaxYCoords.length - 1];

    console.log(maxXCoord, maxYCoord, minXCoord, minYCoord);

    const grid = new Map();
    for (let x = minXCoord.x; x < maxXCoord.x; x++) {
        for (let y = minYCoord.y; y < maxYCoord.y; y++) {
            const distances = coords.map((coord, index) => {
                return {
                    index: index,
                    coord: coord,
                    distance: manhattanDistance(x, coord.x, y, coord.y)
                }
            });
        const shortest = distances.reduce((acc, curr) =>
            acc.distance < curr.distance ? acc : curr
        );
        const coordsInRange = distances.filter(
            distance => distance.distance === shortest.distance
        ).length;
        const closestIndex = coordsInRange === 1 ? shortest.index : ".";
        grid.set(`${x} + ":" + ${y}`, closestIndex);
        }
    }

    const itemsOnPerimeter = new Set();
    for (let x = minXCoord.x; x <= maxXCoord.x; x++) {
        for (let y = minYCoord.y; y <= maxYCoord.y; y++) {
            const perimeterIndex = grid.get(`${x} + ":" + ${y}`);
            itemsOnPerimeter.add(perimeterIndex);
            if (x !== 0 && x !== maxXCoord.x && y !== maxYCoord.y) {
                y = maxYCoord.y - 1;
            }
        }
    }

    const itemCounts = new Map();
    for (let i = 0; i < coords.length; i++) {
        itemCounts.set(i, 0);
    }
    grid.forEach(value => {
        let count = itemCounts.get(value);
        itemCounts.set(value, ++count);
    });

    let largest = 0;
    itemCounts.forEach((value, key) => {
        if (itemsOnPerimeter.has(key) || key === ".") {
            return;
        }
        if (value > largest) {
            largest = value;
        }
    });
    console.log(largest);

    const maxDistance = 10000;
    const newGrid = new Map();
    for (let x = minXCoord.x; x < maxXCoord.x; x++) {
        for (let y = minYCoord.y; y < maxYCoord.y; y++) {
            const distance = coords.map(coord => manhattanDistance(x, coord.x, y, coord.y)).reduce((total, distance) => total + distance);
            newGrid.set(`${x} + ":" + ${y}`, distance);
        }
    }

    console.log(Array.from(newGrid).filter(gridCoord => gridCoord[1] < maxDistance).length);
});