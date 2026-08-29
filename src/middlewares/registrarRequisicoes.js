/**
 * Registra no console cada requisição recebida.
 * Chamar proximo() é obrigatório: sem isso a cadeia trava e o
 * cliente fica aguardando indefinidamente.
 */
function registrarRequisicoes(requisicao, resposta, proximo) {
    const horario = new Date().toISOString();
    console.log(`[${horario}] ${requisicao.method} ${requisicao.originalUrl}`);
    proximo();
}

module.exports = registrarRequisicoes;