/**
 * Padronização do envelope de resposta JSON.
 * Centralizar o formato aqui aplica o princípio DRY e garante
 * previsibilidade para quem consome a API.
 */

function respostaSucesso(resposta, status, mensagem, dados) {
    const corpo = { sucesso: true, mensagem: mensagem };
    if (dados !== undefined) {
        corpo.dados = dados;
    }
    return resposta.status(status).json(corpo);
}

function respostaErro(resposta, status, mensagem, detalhes) {
    const corpo = { sucesso: false, mensagem: mensagem };
    if (detalhes !== undefined) {
        corpo.detalhes = detalhes;
    }
    return resposta.status(status).json(corpo);
}

module.exports = { respostaSucesso, respostaErro };