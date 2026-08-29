/**
 * Entidade de domínio.
 * Define a estrutura do usuário e comportamentos próprios da
 * entidade, evitando que o restante do código manipule objetos
 * genéricos sem contrato definido.
 */
class Usuario {
    constructor({ id, nome, email, dataCriacao, dataAtualizacao }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.dataCriacao = dataCriacao;
        if (dataAtualizacao) {
            this.dataAtualizacao = dataAtualizacao;
        }
    }

    get primeiroNome() {
        return this.nome.trim().split(' ')[0];
    }
}

module.exports = Usuario;