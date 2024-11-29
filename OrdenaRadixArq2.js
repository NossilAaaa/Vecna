const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const fs = require('fs');

const dadosJson = [];

// Início da medição do tempo
const startTime = Date.now();

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

        // Ordenar os dados por 'arq' e 'ordem'
        const sortedByOrder = radixSort(dadosJson, 'ordem');
        const fullySorted = radixSort(sortedByOrder, 'arq');

        // Agrupar por 'arq'
        const agrupadosPorArq = fullySorted.reduce((mapa, obj) => {
            if (!mapa[obj.arq]) mapa[obj.arq] = [];
            mapa[obj.arq].push(obj.notas);
            return mapa;
        }, {});

        // Salvar cada grupo em um arquivo separado
        for (const [arq, notas] of Object.entries(agrupadosPorArq)) {
            const nomeArquivo = `Arq_${arq}.txt`;
            fs.writeFile(nomeArquivo, notas.join('\n'), (err) => {
                if (err) {
                    console.error(`Erro ao salvar o arquivo ${nomeArquivo}:`, err);
                } else {
                    console.log(`Arquivo salvo com sucesso: ${nomeArquivo}`);
                }
            });
        }

        // Fim da medição do tempo
        const endTime = Date.now();
        const executionTime = (endTime - startTime) / 1000; // Em segundos
        console.log(`Tempo total de execução: ${executionTime.toFixed(2)} segundos`);
    });
