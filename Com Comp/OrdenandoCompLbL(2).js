const fs = require('fs');
const readline = require('readline');

// Criação de interface para entrada interativa (para o número "arq")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para processar o arquivo e filtrar os dados por "arq"
const processarArquivo = (arqSelecionado) => {
    const dadosJson = [];

    // Criação da interface para ler o arquivo linha por linha
    const arquivo = readline.createInterface({
        input: fs.createReadStream('Song1LineByLine.txt'),
        output: process.stdout,
        terminal: false
    });

    // Processa o arquivo linha por linha
    arquivo.on('line', (linha) => {
        try {
            // Converte a linha para um objeto JSON
            const obj = JSON.parse(linha);

            // Se o "arq" for igual ao escolhido pelo usuário, armazena o objeto
            if (obj.arq === arqSelecionado) {
                dadosJson.push(obj);
            }
        } catch (err) {
            console.error('Erro ao analisar linha:', err);
        }
    });

    // Quando o arquivo for completamente lido, processa e ordena os dados
    arquivo.on('close', () => {
        if (dadosJson.length === 0) {
            console.log(`Nenhum dado encontrado para o "arq" ${arqSelecionado}.`);
        } else {
            // Ordena os dados conforme o campo "ordem"
            dadosJson.sort((a, b) => a.ordem - b.ordem);

            // Extrai as notas ordenadas
            const notasOrdenadas = dadosJson.map(obj => obj.notas);

            // Define o nome do arquivo de saída
            const nomeArquivoSaida = `notasOrdenadas_${arqSelecionado}.txt`;

            // Salva as notas ordenadas no arquivo
            fs.writeFile(nomeArquivoSaida, notasOrdenadas.join('\n'), (err) => {
                if (err) {
                    console.error('Erro ao salvar o arquivo:', err);
                } else {
                    console.log(`Notas ordenadas para o arq ${arqSelecionado} salvas em ${nomeArquivoSaida}`);
                }
            });
        }
        // Fecha a interface de entrada após processar
        rl.close();
    });
};

// Solicita ao usuário o valor de "arq" para filtrar
rl.question('Digite o valor de "arq" que deseja ordenar: ', (arqSelecionado) => {
    // Converte o valor fornecido para número
    arqSelecionado = parseInt(arqSelecionado, 10);

    if (isNaN(arqSelecionado)) {
        console.log('Por favor, insira um número válido para "arq".');
        rl.close();
    } else {
        // Inicia o processamento do arquivo com o "arq" selecionado
        processarArquivo(arqSelecionado);
    }
});
