const fs = require('fs');
const moment = require('moment');
fs.readFile('input.txt',(err, fd) => {
    if (err) {
        throw err;
    }
    const shifts = fd.toString().split('\r\n');
    // [
    //     '[1518-11-01 00:00] Guard #10 begins shift',
    //     '[1518-11-01 00:05] falls asleep',
    //     '[1518-11-01 00:25] wakes up',
    //     '[1518-11-01 00:30] falls asleep',
    //     '[1518-11-01 00:55] wakes up',
    //     '[1518-11-01 23:58] Guard #99 begins shift',
    //     '[1518-11-02 00:40] falls asleep',
    //     '[1518-11-02 00:50] wakes up',
    //     '[1518-11-03 00:05] Guard #10 begins shift',
    //     '[1518-11-03 00:24] falls asleep',
    //     '[1518-11-03 00:29] wakes up',
    //     '[1518-11-04 00:02] Guard #99 begins shift',
    //     '[1518-11-04 00:36] falls asleep',
    //     '[1518-11-04 00:46] wakes up',
    //     '[1518-11-05 00:03] Guard #99 begins shift',
    //     '[1518-11-05 00:45] falls asleep',
    //     '[1518-11-05 00:55] wakes up'
    // ]
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
    const mostFrequentSleepingMinute = minuteKeys.reduce((a, b) => longestSleeperMinutes[a] > longestSleeperMinutes[b] ? a : b);
    console.log(mostFrequentSleepingMinute * longestNap.guard);
});