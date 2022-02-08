const readline = require('readline');
const fs = require('fs');

const LINE_COUNT = new Map()
LINE_COUNT.set('3', 621)
LINE_COUNT.set('4', 2175)
LINE_COUNT.set('5', 5136)
LINE_COUNT.set('6', 7494)
LINE_COUNT.set('7', 8878)
LINE_COUNT.set('8', 9448)
LINE_COUNT.set('9', 8847)
LINE_COUNT.set('10', 7496)

module.exports = async (howLong) => {
    const randomLineIndex = Math.floor(Math.random() * LINE_COUNT.get(howLong));
    return await getLineContent(howLong, randomLineIndex);
}

function getLineReader(howLong) {
    return readline.createInterface({
        input: fs.createReadStream('resources/' + howLong + '-letters-nouns.txt')
    })
}

async function getLineContent(howLong, index) {
    return new Promise(resolve =>     {
        let counter = 0;
        getLineReader(howLong).on('line', function (line) {
            if (counter === index) {
                resolve(line);
            }
            counter++
        })
    })
}