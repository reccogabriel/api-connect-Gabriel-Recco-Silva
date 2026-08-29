/**
 * Middleware global de erros, identificado pela assinatura de
 * quatro parâmetros. Único ponto de saída das respostas de falha.
 */
const { respostaErro } = require('../utils/respostas');

function tratadorErros(erro, requisicao, resposta, proximo) {
    console.error('Erro capturado:', erro.message);

    const status = erro.statusHttp || 500;

    // Falhas inesperadas recebem mensagem genérica, para não expor
    // detalhes internos da implementação ao cliente.
    const mensagem = status === 500 ? 'Erro interno do servidor' : erro.message;

    return respostaErro(resposta, status, mensagem, erro.detalhes);
}

module.exports = tratadorErros;