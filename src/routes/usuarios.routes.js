/**
 * Camada de roteamento.
 * Mapeia verbo HTTP e caminho para o manipulador correspondente.
 */

const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');

const rotas = express.Router();

// Os caminhos são relativos ao prefixo definido no server.js,
// portanto '/' equivale a /usuarios. A rota '/' vem antes de
// '/:id' porque o Express avalia na ordem de declaração.
rotas.get('/', usuariosController.listar);
rotas.get('/:id', usuariosController.obterPorId);
rotas.post('/', usuariosController.criar);
rotas.put('/:id', usuariosController.atualizar);
rotas.delete('/:id', usuariosController.remover);

module.exports = rotas;