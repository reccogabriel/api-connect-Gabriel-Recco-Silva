/**
 * Camada de apresentação.
 * Recebe requisição e resposta, delega ao serviço e formata a
 * saída HTTP. Não contém regras de negócio.
 */

const usuariosService = require('../services/usuarios.service');
const { respostaSucesso } = require('../utils/respostas');

// GET /usuarios -> 200
// Lista vazia também é 200: a operação foi bem-sucedida.
function listar(requisicao, resposta, proximo) {
    try {
        const usuarios = usuariosService.listar();
        return respostaSucesso(
            resposta,
            200,
            'Usuários listados com sucesso',
            usuarios
        );
    } catch (erro) {
        return proximo(erro);
    }
}

// GET /usuarios/:id -> 200 | 400 | 404
function obterPorId(requisicao, resposta, proximo) {
    try {
        const usuario = usuariosService.obterPorId(requisicao.params.id);
        return respostaSucesso(
            resposta,
            200,
            'Usuário encontrado com sucesso',
            usuario
        );
    } catch (erro) {
        return proximo(erro);
    }
}

// POST /usuarios -> 201 | 400 | 409
// O cabeçalho Location aponta a URI do recurso recém-criado.
function criar(requisicao, resposta, proximo) {
    try {
        const novo = usuariosService.criar(requisicao.body);
        resposta.setHeader('Location', `/usuarios/${novo.id}`);
        return respostaSucesso(resposta, 201, 'Usuário criado com sucesso', novo);
    } catch (erro) {
        return proximo(erro);
    }
}

// PUT /usuarios/:id -> 200 | 400 | 404 | 409
function atualizar(requisicao, resposta, proximo) {
    try {
        const usuario = usuariosService.atualizar(
            requisicao.params.id,
            requisicao.body
        );
        return respostaSucesso(
            resposta,
            200,
            'Usuário atualizado com sucesso',
            usuario
        );
    } catch (erro) {
        return proximo(erro);
    }
}

// DELETE /usuarios/:id -> 204 | 400 | 404
// O método send() encerra a resposta sem corpo.
function remover(requisicao, resposta, proximo) {
    try {
        usuariosService.remover(requisicao.params.id);
        return resposta.status(204).send();
    } catch (erro) {
        return proximo(erro);
    }
}

module.exports = { listar, obterPorId, criar, atualizar, remover };