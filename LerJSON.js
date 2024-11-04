const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const fs = require('fs');

const dadosJson = [];

const arquivo = fs.createReadStream('Song1JSONvector.txt');
const jsonParser = parser(); 

arquivo
    .pipe(jsonParser) 
    .pipe(streamArray()) 
    .on('data', ({ key, value }) => {
        dadosJson.push(value); 
    })
    .on('end', () => {
        console.log('Leitura do arquivo JSON finalizada:', dadosJson);
    });
