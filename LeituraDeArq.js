const fs = require('fs');
const readline = require('readline');

// Conjunto para armazenar os números "arq" que já foram encontrados
const arqsEncontrados = new Set();

// Configuração do readline para ler o arquivo linha por linha
const arquivo = readline.createInterface({
    input: fs.createReadStream('Song1LineByLine.txt'),
    output: process.stdout,
    terminal: false
});

// Função para processar cada linha do arquivo
arquivo.on('line', (linha) => {
    try {
        // Tenta converter a linha para um objeto JSON
        const obj = JSON.parse(linha);

        // Verifica se o objeto possui o campo "arq"
        if (obj.arq !== undefined) {
            // Se o número "arq" não foi exibido antes, exibe e adiciona ao conjunto
            if (!arqsEncontrados.has(obj.arq)) {
                console.log(`Existe o arq com o número: ${obj.arq}`);
                arqsEncontrados.add(obj.arq);
            }
        }
    } catch (err) {
        console.error('Erro ao analisar linha:', err);
    }
});

// Evento que ocorre quando o arquivo foi totalmente lido
arquivo.on('close', () => {
    console.log('Leitura do arquivo concluída.');
});
