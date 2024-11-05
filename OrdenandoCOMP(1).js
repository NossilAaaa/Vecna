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
        dadosJson.sort((a, b) => {
            if (a.arq === b.arq) {
                return a.ordem - b.ordem; 
            }
            return a.arq - b.arq; 
        });

        const notasOrdenadas = dadosJson.map(obj => obj.notas);

        fs.writeFile('OrdenadasJson.txt', notasOrdenadas.join('\n'), (err) => {
            if (err) {
                console.error('Erro ao salvar o arquivo:', err);
            } else {
                console.log('Arquivo salvo com sucesso: notasOrdenadas.txt');
            }
        });
    });
