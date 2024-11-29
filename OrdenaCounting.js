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
        const findMax = (array, key) => {
            let max = 0;
            for (const obj of array) {
                if (obj[key] > max) {
                    max = obj[key];
                }
            }
            return max;
        };

        const countingSort = (array, key) => {
            const max = findMax(array, key);
            const count = new Array(max + 1).fill(0);
            const output = new Array(array.length);

            // Contar a frequência de cada valor
            for (const obj of array) {
                count[obj[key]]++;
            }

            // Calcular os índices acumulados
            for (let i = 1; i < count.length; i++) {
                count[i] += count[i - 1];
            }

            // Construir o array ordenado
            for (let i = array.length - 1; i >= 0; i--) {
                const obj = array[i];
                const index = count[obj[key]] - 1;
                output[index] = obj;
                count[obj[key]]--;
            }

            return output;
        };

        // Ordenar os dados por 'ordem' e depois por 'arq'
        const sortedByOrder = countingSort(dadosJson, 'ordem');
        const fullySorted = countingSort(sortedByOrder, 'arq');

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
    });
