const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const fs = require('fs');
const { performance } = require('perf_hooks'); // Para medição precisa do tempo

const dadosJson = [];

const arquivo = fs.createReadStream('Song1JSONvector.txt');
const jsonParser = parser();

const arqEscolhido = 22; // Substitua pelo número do arq desejado

// Inicia a contagem de tempo
const startTime = performance.now();

arquivo
    .pipe(jsonParser)
    .pipe(streamArray())
    .on('data', ({ key, value }) => {
        if (value.arq === arqEscolhido) {
            dadosJson.push(value); // Só adiciona os dados do 'arq' escolhido
        }
    })
    .on('end', () => {
        // Medir tempo após o processamento do arquivo
        const processingEndTime = performance.now();

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

        const sortingEndTime = performance.now(); // Tempo após ordenação

        const nomeArquivo = `Arq_${arqEscolhido}.txt`;
        fs.writeFile(nomeArquivo, notasOrdenadas.join('\n'), (err) => {
            if (err) {
                console.error(`Erro ao salvar o arquivo ${nomeArquivo}:`, err);
            } else {
                console.log(`Arquivo salvo com sucesso: ${nomeArquivo}`);
            }

            // Medir tempo total
            const endTime = performance.now();
            console.log(`Tempo total de execução: ${((endTime - startTime) / 1000).toFixed(2)} segundos`);
            console.log(`Tempo de processamento do arquivo: ${((processingEndTime - startTime) / 1000).toFixed(2)} segundos`);
            console.log(`Tempo de ordenação: ${((sortingEndTime - processingEndTime) / 1000).toFixed(2)} segundos`);
            console.log(`Tempo de escrita do arquivo: ${((endTime - sortingEndTime) / 1000).toFixed(2)} segundos`);
        });
    });
