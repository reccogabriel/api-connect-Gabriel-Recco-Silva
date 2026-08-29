/**
 * Hierarquia de erros da aplicação.
 * Cada classe carrega o código HTTP correspondente, permitindo
 * que o middleware global traduza a exceção em resposta sem
 * conhecer as regras de negócio.
 */

class ErroAplicacao extends Error {
    constructor(mensagem, statusHttp, detalhes) {
        super(mensagem);
        this.name = this.constructor.name;
        this.statusHttp = statusHttp;
        this.detalhes = detalhes;
    }
}

// 400: dados enviados pelo cliente não passaram na validação
class ErroValidacao extends ErroAplicacao {
    constructor(mensagem, detalhes) {
        super(mensagem, 400, detalhes);
    }
}

// 409: requisição válida, mas conflita com o estado atual
class ErroConflito extends ErroAplicacao {
    constructor(mensagem) {
        super(mensagem, 409);
    }
}

// 404: recurso solicitado não existe
class ErroNaoEncontrado extends ErroAplicacao {
    constructor(mensagem) {
        super(mensagem, 404);
    }
}

module.exports = {
    ErroAplicacao,
    ErroValidacao,
    ErroConflito,
    ErroNaoEncontrado
};