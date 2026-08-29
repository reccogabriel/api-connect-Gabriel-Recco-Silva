/**
 * Alcançado quando nenhuma rota anterior corresponde ao caminho.
 * Garante resposta em JSON em vez da página HTML padrão do Express.
 */
const { respostaErro } = require('../utils/respostas');

function rotaNaoEncontrada(requisicao, resposta) {
    return respostaErro(
        resposta,
        404,
        'Rota não encontrada',
        requisicao.originalUrl
    );
}

module.exports = rotaNaoEncontrada;