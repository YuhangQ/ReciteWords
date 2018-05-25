const fs = require('fs');

let datas = {};

let files = fs.readdirSync('./sources');
for(let i in files) {
    let filePath = './sources/' + files[i];
    let file = fs.readFileSync(filePath).toString().split('\n');
    let words = [];
    for(let i=1; i<file.length; i++) {
        let t = file[i].split('----');
        words.push({
            English: t[0],
            Chinese: t[1]
        });
    }
    datas[file[0]] = words;
}

module.exports = datas;