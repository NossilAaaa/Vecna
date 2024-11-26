const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const fs = require('fs');

const dadosJson = [];

const arquivo = fs.createReadStream('Song1JSONvector.txt');
const jsonParser = parser();

const arqEscolhido = 17; // Substitua pelo número do arq desejado

arquivo
    .pipe(jsonParser)
    .pipe(streamArray())
    .on('data', ({ key, value }) => {
        if (value.arq === arqEscolhido) {
            dadosJson.push(value); // Só adiciona os dados do 'arq' escolhido
        }
    })
    .on('end', () => {
        const findMax = (array, key) => {
            let max = 0;
            for (const obj of array) {
                if (obj[key] > max) {
                    max = obj[key];
                }
            }
            return max;
        };

        const radixSort = (array, key) => {
            const max = findMax(array, key);
            let divisor = 1;

            while (divisor <= max) {
                const buckets = Array.from({ length: 10 }, () => []);

                for (const obj of array) {
                    const digit = Math.floor(obj[key] / divisor) % 10;
                    buckets[digit].push(obj);
                }

                array = buckets.flat();
                divisor *= 10;
            }
            return array;
        };

        const sortedByOrder = radixSort(dadosJson, 'ordem');
        const notasOrdenadas = sortedByOrder.map(obj => obj.notas);

        const nomeArquivo = `Arq_${arqEscolhido}.txt`;
        fs.writeFile(nomeArquivo, notasOrdenadas.join('\n'), (err) => {
            if (err) {
                console.error(`Erro ao salvar o arquivo ${nomeArquivo}:`, err);
            } else {
                console.log(`Arquivo salvo com sucesso: ${nomeArquivo}`);
            }
        });
    });
