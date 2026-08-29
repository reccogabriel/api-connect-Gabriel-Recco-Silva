/**
 * Camada de lógica de negócio.
 * Concentra validações e regras, independente de HTTP.
 */

const usuariosRepository = require('../repositories/usuarios.repository');
const {
    ErroValidacao,
    ErroConflito,
    ErroNaoEncontrado
} = require('../utils/erros');

const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * O identificador chega da URL como texto. Sem a conversão, a
 * comparação estrita com o número armazenado falharia.
 */
function converterId(idRecebido) {
    const id = Number(idRecebido);
    if (!Number.isInteger(id) || id < 1) {
        throw new ErroValidacao(
            'O identificador informado deve ser um número inteiro positivo'
        );
    }
    return id;
}

/**
 * Acumula todos os problemas antes de lançar a exceção, para que
 * o cliente receba a lista completa em uma única resposta.
 */
function validarDados(dados) {
    if (!dados || typeof dados !== 'object') {
        throw new ErroValidacao('Corpo da requisição ausente ou inválido');
    }

    const problemas = [];
    const { nome, email } = dados;

    if (typeof nome !== 'string') {
        problemas.push('O campo nome é obrigatório e deve ser um texto');
    } else if (nome.trim().length < 3) {
        problemas.push('O campo nome deve ter ao menos 3 caracteres');
    }

    if (typeof email !== 'string') {
        problemas.push('O campo email é obrigatório e deve ser um texto');
    } else if (!PADRAO_EMAIL.test(email.trim())) {
        problemas.push('O campo email deve estar em formato válido');
    }

    if (problemas.length > 0) {
        throw new ErroValidacao('Dados inválidos', problemas);
    }

    // Normalização evita duplicidades como Ana@Email.com e ana@email.com
    return {
        nome: nome.trim(),
        email: email.trim().toLowerCase()
    };
}

function listar() {
    return usuariosRepository.listar();
}

function obterPorId(idRecebido) {
    const id = converterId(idRecebido);
    const usuario = usuariosRepository.obterPorId(id);
    if (!usuario) {
        throw new ErroNaoEncontrado(`Usuário com id ${id} não encontrado`);
    }
    return usuario;
}

function criar(dados) {
    const novos = validarDados(dados);
    if (usuariosRepository.obterPorEmail(novos.email)) {
        throw new ErroConflito('Já existe um usuário cadastrado com este e-mail');
    }
    return usuariosRepository.salvar(novos);
}

function atualizar(idRecebido, dados) {
    const id = converterId(idRecebido);

    // A existência é verificada antes da validação de conteúdo,
    // pois um id ausente deve gerar 404 e não 400.
    if (!usuariosRepository.obterPorId(id)) {
        throw new ErroNaoEncontrado(`Usuário com id ${id} não encontrado`);
    }

    const novos = validarDados(dados);

    // A comparação de id permite que o próprio usuário mantenha
    // seu endereço atual sem gerar conflito.
    const dono = usuariosRepository.obterPorEmail(novos.email);
    if (dono && dono.id !== id) {
        throw new ErroConflito('Este e-mail já pertence a outro usuário');
    }

    return usuariosRepository.atualizar(id, novos);
}

function remover(idRecebido) {
    const id = converterId(idRecebido);
    if (!usuariosRepository.remover(id)) {
        throw new ErroNaoEncontrado(`Usuário com id ${id} não encontrado`);
    }
}

module.exports = { listar, obterPorId, criar, atualizar, remover };