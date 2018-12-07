const fs = require('fs');
const moment = require('moment');
fs.readFile('input.txt',(err, fd) => {
    if (err) {
        throw err;
    }
    const shifts = fd.toString().split('\r\n');
    let guardNumber = undefined;
    let guards = {};
    let formattedShifts = shifts.map(shift => {
        const time = shift.split(']')[0].replace('[', '');
        let command = '';
        if (shift.includes('#')) {
            guardNumber = shift.split('#')[1].split(' ')[0];
            command = 'begins shift';
        } else {
            command = shift.split(']')[1];
        }

        return {
            time: time,
            command: command,
            guardNumber: guardNumber
        }
    }).sort((a, b) => moment(a.time).isBefore(moment(b.time)) ? -1 : 1);
    formattedShifts = formattedShifts.map(shift => {
        if (shift.command === 'begins shift') {
            guardNumber = shift.guardNumber;
        }

        return {
            ...shift,
            guardNumber: guardNumber
        }
    });
    let longestNap = {
        guard: '',
        sum: 0
    }
    formattedShifts.forEach((shift, index) => {
        if (guards[shift.guardNumber] === undefined) {
            guards[shift.guardNumber] = {
                napTimes: [],
                napMinutes: {},
                sum: 0,
                mostFrequentMinAsleep: {}
            }
        }
        if (shift.command === ' falls asleep' && formattedShifts[index + 1] !== undefined) {
            let startNap = moment(shift.time);
            let endNap = moment(formattedShifts[index + 1].time);
            let napDuration = moment.duration(endNap.diff(startNap)).asMinutes();
            for (let x = 0; x < napDuration; x++) {
                if (guards[shift.guardNumber].napMinutes[startNap.format('mm')] !== undefined) {
                    guards[shift.guardNumber].napMinutes[startNap.format('mm')] = guards[shift.guardNumber].napMinutes[startNap.format('mm')] + 1
                } else {
                    guards[shift.guardNumber].napMinutes[startNap.format('mm')] = 1;
                }
                startNap = startNap.add(1, 'minute');
            }
            guards[shift.guardNumber].napTimes.push(napDuration);
            guards[shift.guardNumber].sum = guards[shift.guardNumber].napTimes.reduce((a,b) => a+b, 0);
            if (guards[shift.guardNumber].sum >= longestNap.sum) {
                longestNap = {
                    guard: shift.guardNumber,
                    sum: guards[shift.guardNumber].sum
                }
            }
        }
    });
    const longestSleeperMinutes = guards[longestNap.guard].napMinutes;
    const minuteKeys = Object.keys(longestSleeperMinutes);
    let sameMinSleep = {
        guard: '',
        min: '',
        times: 0
    }
    const mostFrequentSleepingMinute = minuteKeys.reduce((a, b) => longestSleeperMinutes[a] > longestSleeperMinutes[b] ? a : b);
    console.log(mostFrequentSleepingMinute * longestNap.guard);
    
    formattedShifts.forEach(shift => {
        const mins = Object.keys(guards[shift.guardNumber].napMinutes);
        if (mins.length !== 0) {
            const mostFrequentSleepingMinuteCount = mins.reduce((a, b) => guards[shift.guardNumber].napMinutes[a] > guards[shift.guardNumber].napMinutes[b] ? a : b);
            if (guards[shift.guardNumber].napMinutes[mostFrequentSleepingMinuteCount] > sameMinSleep.times) {
                sameMinSleep = {
                    guard: shift.guardNumber,
                    min: mostFrequentSleepingMinuteCount,
                    times: guards[shift.guardNumber].napMinutes[mostFrequentSleepingMinuteCount]
                }
            }
        }
    });
    console.log(parseInt(sameMinSleep.guard) * parseInt(sameMinSleep.min));
});