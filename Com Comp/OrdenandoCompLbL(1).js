const fs = require('fs');
const readline = require('readline');

const dadosJson = [];

const arquivo = readline.createInterface({
    input: fs.createReadStream('Song1LineByLine.txt'),
    output: process.stdout,
    terminal: false
});

arquivo.on('line', (linha) => {
    try {
        const obj = JSON.parse(linha);
        
        dadosJson.push(obj);
    } catch (err) {
        console.error('Erro ao analisar linha:', err);
    }
});

arquivo.on('close', () => {
    
    dadosJson.sort((a, b) => {
        if (a.arq === b.arq) {
            return a.ordem - b.ordem;
        }
        return a.arq - b.arq;
    });

    const notasOrdenadas = dadosJson.map(obj => obj.notas);

    fs.writeFile('OrdenadasLBL.txt', notasOrdenadas.join('\n'), (err) => {
        if (err) {
            console.error('Erro ao salvar o arquivo:', err);
        } else {
            console.log('Arquivo salvo com sucesso: notasOrdenadas.txt');
        }
    });
});
