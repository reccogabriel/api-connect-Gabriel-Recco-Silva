/**
 * Repositório de Usuários
 * Camada de persistência. Responsabilidade exclusiva: leitura e
 * escrita dos dados. Nenhuma regra de negócio reside aqui.
 */

const fs = require('fs');
const path = require('path');

const CAMINHO_ARQUIVO = path.join(__dirname, '..', 'data', 'usuarios.json');

function carregarDados() {
    try {
        if (!fs.existsSync(CAMINHO_ARQUIVO)) {
            fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
        const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, 'utf-8');
        if (!conteudo.trim()) {
            return [];
        }
        return JSON.parse(conteudo);
    } catch (erro) {
        console.error('Falha ao carregar o arquivo de usuários:', erro.message);
        return [];
    }
}

function salvarDados(usuarios) {
    fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(usuarios, null, 2), 'utf-8');
}

/**
 * Geração de ID incremental. Localiza o maior ID em uso e devolve
 * o próximo da sequência. Usar o maior valor, em vez do tamanho do
 * array, evita reaproveitar identificadores após remoções.
 */
function gerarProximoId(usuarios) {
    if (usuarios.length === 0) {
        return 1;
    }
    const maiorId = usuarios.reduce(
        (maior, usuario) => (usuario.id > maior ? usuario.id : maior),
        0
    );
    return maiorId + 1;
}

function listar() {
    return carregarDados();
}

function obterPorId(id) {
    const usuarios = carregarDados();
    return usuarios.find((usuario) => usuario.id === id) || null;
}

function obterPorEmail(email) {
    const usuarios = carregarDados();
    return usuarios.find(
        (usuario) => usuario.email.toLowerCase() === email.toLowerCase()
    ) || null;
}

function salvar(dadosUsuario) {
    const usuarios = carregarDados();
    const novoUsuario = {
        id: gerarProximoId(usuarios),
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        dataCriacao: new Date().toISOString()
    };
    usuarios.push(novoUsuario);
    salvarDados(usuarios);
    return novoUsuario;
}

function atualizar(id, dadosUsuario) {
    const usuarios = carregarDados();
    const indice = usuarios.findIndex((usuario) => usuario.id === id);
    if (indice === -1) {
        return null;
    }
    // Reatribuir o id impede que o cliente altere o identificador.
    usuarios[indice] = {
        ...usuarios[indice],
        ...dadosUsuario,
        id: usuarios[indice].id,
        dataAtualizacao: new Date().toISOString()
    };
    salvarDados(usuarios);
    return usuarios[indice];
}

function remover(id) {
    const usuarios = carregarDados();
    const indice = usuarios.findIndex((usuario) => usuario.id === id);
    if (indice === -1) {
        return false;
    }
    usuarios.splice(indice, 1);
    salvarDados(usuarios);
    return true;
}

module.exports = {
    listar,
    obterPorId,
    obterPorEmail,
    salvar,
    atualizar,
    remover
};