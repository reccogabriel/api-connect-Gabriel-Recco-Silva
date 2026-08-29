/**
 * API Connect - Servidor principal
 * Plataforma de gerenciamento de usuários (MVP)
 */

const express = require('express');
const usuariosRoutes = require('./routes/usuarios.routes');
const registrarRequisicoes = require('./middlewares/registrarRequisicoes');
const rotaNaoEncontrada = require('./middlewares/rotaNaoEncontrada');
const tratadorErros = require('./middlewares/tratadorErros');

const app = express();

// A porta é lida de variável de ambiente para não ficar fixa no
// código, permitindo que o ambiente de hospedagem a defina.
const PORT = process.env.PORT || 3000;

// Middlewares globais, registrados antes das rotas porque a
// cadeia é executada na ordem de declaração.
app.use(express.json());
app.use(registrarRequisicoes);

// Rota de verificação de disponibilidade
app.get('/', (requisicao, resposta) => {
    return resposta.status(200).json({
        sucesso: true,
        mensagem: 'API Connect está no ar',
        versao: '1.0.0',
        endpoints: {
            listar: 'GET /usuarios',
            buscar: 'GET /usuarios/:id',
            criar: 'POST /usuarios',
            atualizar: 'PUT /usuarios/:id',
            remover: 'DELETE /usuarios/:id'
        }
    });
});

// Módulo de rotas de usuários
app.use('/usuarios', usuariosRoutes);

// Estes dois vêm por último: o de rota inexistente só é alcançado
// quando nada antes correspondeu, e o tratador de erros encerra a
// cadeia convertendo exceções em respostas.
app.use(rotaNaoEncontrada);
app.use(tratadorErros);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;