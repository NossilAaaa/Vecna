const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const fs = require('fs');

const dadosJson = [];

// Cria um stream para ler o arquivo
const arquivo = fs.createReadStream('Song1JSONvector.txt');
const jsonParser = parser();

arquivo
    .pipe(jsonParser)
    .pipe(streamArray())
    .on('data', ({ key, value }) => {
        dadosJson.push(value); // Armazena cada elemento no array
    })
    .on('end', () => {
        // Função para encontrar o maior valor (evita Math.max com spread)
        const findMax = (array, key) => {
            let max = 0;
            for (const obj of array) {
                if (obj[key] > max) {
                    max = obj[key];
                }
            }
            return max;
        };

        // Implementação do Radix Sort
        const radixSort = (array, key) => {
            const max = findMax(array, key); // Encontra o maior valor
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

        // Ordenar primeiro por 'ordem', depois por 'arq'
        const sortedByOrder = radixSort(dadosJson, 'ordem');
        const fullySorted = radixSort(sortedByOrder, 'arq');

        // Extrair e salvar as notas ordenadas
        const notasOrdenadas = fullySorted.map(obj => obj.notas);
        fs.writeFile('OrdenadasJson.txt', notasOrdenadas.join('\n'), (err) => {
            if (err) {
                console.error('Erro ao salvar o arquivo:', err);
            } else {
                console.log('Arquivo salvo com sucesso: OrdenadasJson.txt');
            }
        });
    });
