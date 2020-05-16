var fs = require('fs');
let rules = {};

let progress = 'intro';

let activeword = '';
let newword = false;

let activeline = '';

let outer = '~~';
let inner = '~~';

fs.readFile('rules.txt', 'utf8', function (err, str) {
    data = str.split('\n');
    for (let i = 0; i < data.length; i++) {
        let line = data[i];
        if (progress == 'Glossary') {
            if (line.includes('Credits')) {
                progress = 'end';
            } else if (newword) {
                if (line.length >= 1) {
                    rules.Glossary[line] = '';
                    activeword = line;
                    newword = false;
                }
            } else if (line.length <= 1) {
                newword = true;
                activeword = '';
            } else {
                rules.Glossary[activeword] = rules.Glossary[activeword] + line;
            }
        } else if (progress == 'rules') {
            if (line.includes('Glossary')) {
                progress = 'Glossary';
                rules.Glossary = {};
            } else if (rules[line] && line.length >= 1) {
                outer = line;
            } else if (rules[outer] && rules[outer][line]) {
                inner = line;
            } else if (line.length >= 1) {
                if (!rules[outer]) {
                    rules[outer] = { [inner]: [] };
                }
                if (!rules[outer][inner]) {
                    rules[outer][inner] = [];
                }
                rules[outer][inner].push(line);
            }
        } else if (progress == 'contents') {
            if (line.includes('Credits')) {
                progress = 'rules';
            } else if (line.length <= 1) {
                newword = true;
                activeline = '';
            } else if (line[1] && line[1] == '.') {
                rules[line] = {};
                activeline = line;
            } else if (line[3] && line[3] == '.') {
                rules[activeline][line] = [];
            }
        } else if (progress == 'intro') {
            if (line.includes('Contents')) {
                progress = 'contents';
            }
        }
    }

    let json = JSON.stringify(rules);
    fs.writeFile('rules.json', json, 'utf8', function (err, data) {
        console.log('Success');
    });
});

// var fs = require('fs');
// let rules = {};

// let progress = 'intro';

// let activeword = '';
// let newword = false;

// let activeline = '';

// let outer = '~~';
// let inner = '~~';

// fs.readFile('rules.txt', 'utf8', function (err, str) {
//     data = str.split('\n');
//     for (let i = 0; i < data.length; i++) {
//         let line = data[i];
//         if (progress == 'Glossary') {
//             if (line.includes('Credits')) {
//                 progress = 'end';
//             } else if (newword) {
//                 if (line.length >= 1) {
//                     rules.Glossary[line] = '';
//                     activeword = line;
//                     newword = false;
//                 }
//             } else if (line.length <= 1) {
//                 newword = true;
//                 activeword = '';
//             } else {
//                 rules.Glossary[activeword] = rules.Glossary[activeword] + line;
//             }
//         } else if (progress == 'rules') {
//             if (line.includes('Glossary')) {
//                 progress = 'Glossary';
//                 rules.Glossary = {};
//             } else if (rules[line] && line.length >= 1) {
//                 outer = line;
//             } else if (rules[outer] && rules[outer][line]) {
//                 inner = line;
//             } else if (line.length >= 1) {
//                 rules[outer][inner].push(line);
//             }
//         } else if (progress == 'contents') {
//             if (line.includes('Credits')) {
//                 progress = 'rules';
//             } else if (line.length <= 1) {
//                 newword = true;
//                 activeline = '';
//             } else if (line[1] && line[1] == '.') {
//                 rules[line] = {};
//                 activeline = line;
//             } else if (line[3] && line[3] == '.') {
//                 rules[activeline][line] = [];
//             }
//         } else if (progress == 'intro') {
//             if (line.includes('Contents')) {
//                 progress = 'contents';
//             }
//         }
//     }

//     let json = JSON.stringify(rules);
//     fs.writeFile('rules.json', json, 'utf8', function (err, data) {
//         console.log('Success');
//     });
// });
