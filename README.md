# API Connect

API REST para gerenciamento de usuários, desenvolvida como MVP para validação de uma nova ideia de negócio.

## Objetivo

Fornecer à equipe de front-end um serviço capaz de cadastrar, consultar, atualizar e remover usuários, com comunicação exclusivamente em JSON, respostas padronizadas e códigos de status HTTP semanticamente corretos.

Ainda que se trate de um Produto Mínimo Viável, o projeto segue práticas profissionais de organização de código, com separação de responsabilidades em camadas, validação de entrada no servidor e tratamento centralizado de erros.

## Tecnologias utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | 24.x (LTS) | Ambiente de execução JavaScript no servidor |
| Express | 5.2.1 | Framework de roteamento e middlewares |
| nodemon | 3.1.14 | Reinício automático do servidor em desenvolvimento |

A persistência é simulada em arquivo JSON local, sem banco de dados, conforme o escopo do MVP.

## Estrutura do projeto

```
api-connect/
├── src/
│   ├── controllers/     # Camada de apresentação: recebe requisições e formata respostas
│   ├── services/        # Camada de negócio: regras, validações e orquestração
│   ├── repositories/    # Camada de persistência: leitura e escrita dos dados
│   ├── routes/          # Definição das rotas e vínculo com os controllers
│   ├── middlewares/     # Log, rota não encontrada e tratamento de erros
│   ├── models/          # Entidades de domínio
│   ├── utils/           # Padronização de respostas e hierarquia de erros
│   ├── data/            # Arquivo JSON de persistência simulada
│   └── server.js        # Ponto de entrada da aplicação
├── .gitignore
├── package.json
└── README.md
```

Cada diretório concentra uma responsabilidade única. Uma mudança na forma de acesso aos dados, por exemplo, fica restrita ao diretório de repositórios, sem impacto sobre as regras de negócio ou sobre a camada de apresentação.

## Como executar localmente

### Pré-requisitos

- Node.js versão 18 ou superior
- npm (instalado junto com o Node.js)

### Passo a passo

1. Clone o repositório:

```
git clone https://github.com/reccogabriel/api-connect-Gabriel-Recco-Silva.git
```

2. Acesse a pasta do projeto:

```
cd api-connect-Gabriel-Recco-Silva
```

3. Instale as dependências:

```
npm install
```

4. Inicie o servidor:

```
npm run dev
```

O servidor sobe em `http://localhost:3000`. Para executar sem recarga automática, use `npm start`.

A porta pode ser alterada pela variável de ambiente `PORT`.

## Endpoints

Base URL: `http://localhost:3000`

| Método | Rota | Descrição | Sucesso | Erros possíveis |
|---|---|---|---|---|
| GET | `/` | Verificação de disponibilidade da API | 200 | - |
| GET | `/usuarios` | Lista todos os usuários | 200 | - |
| GET | `/usuarios/:id` | Busca um usuário por ID | 200 | 400, 404 |
| POST | `/usuarios` | Cadastra um novo usuário | 201 | 400, 409 |
| PUT | `/usuarios/:id` | Atualiza um usuário existente | 200 | 400, 404, 409 |
| DELETE | `/usuarios/:id` | Remove um usuário | 204 | 400, 404 |

## Exemplos de uso

### Cadastrar usuário

Requisição:

```
POST /usuarios
Content-Type: application/json

{
  "nome": "Ana Silva",
  "email": "ana@email.com"
}
```

Resposta `201 Created`:

```json
{
  "sucesso": true,
  "mensagem": "Usuário criado com sucesso",
  "dados": {
    "id": 1,
    "nome": "Ana Silva",
    "email": "ana@email.com",
    "dataCriacao": "2026-08-29T17:01:04.959Z"
  }
}
```

### Listar usuários

Requisição:

```
GET /usuarios
```

Resposta `200 OK`:

```json
{
  "sucesso": true,
  "mensagem": "Usuários listados com sucesso",
  "dados": [
    {
      "id": 1,
      "nome": "Ana Silva",
      "email": "ana@email.com",
      "dataCriacao": "2026-08-29T17:01:04.959Z"
    }
  ]
}
```

### Buscar usuário por ID

Requisição:

```
GET /usuarios/1
```

Resposta `200 OK`:

```json
{
  "sucesso": true,
  "mensagem": "Usuário encontrado com sucesso",
  "dados": {
    "id": 1,
    "nome": "Ana Silva",
    "email": "ana@email.com",
    "dataCriacao": "2026-08-29T17:01:04.959Z"
  }
}
```

Caso o identificador não exista, a resposta é `404 Not Found`:

```json
{
  "sucesso": false,
  "mensagem": "Usuário com id 999 não encontrado"
}
```

### Atualizar usuário

Requisição:

```
PUT /usuarios/1
Content-Type: application/json

{
  "nome": "Ana Paula Silva",
  "email": "ana.paula@email.com"
}
```

Resposta `200 OK`:

```json
{
  "sucesso": true,
  "mensagem": "Usuário atualizado com sucesso",
  "dados": {
    "id": 1,
    "nome": "Ana Paula Silva",
    "email": "ana.paula@email.com",
    "dataCriacao": "2026-08-29T17:01:04.959Z",
    "dataAtualizacao": "2026-08-29T17:12:40.118Z"
  }
}
```

### Remover usuário

Requisição:

```
DELETE /usuarios/1
```

Resposta `204 No Content`, sem corpo.

### Exemplo de falha de validação

Requisição:

```
POST /usuarios
Content-Type: application/json

{
  "nome": "Carlos Souza"
}
```

Resposta `400 Bad Request`:

```json
{
  "sucesso": false,
  "mensagem": "Dados inválidos",
  "detalhes": [
    "O campo email é obrigatório e deve ser um texto"
  ]
}
```

## Padrão de respostas

Todas as respostas seguem um envelope comum, o que dá previsibilidade a quem consome a API.

Sucesso:

```json
{
  "sucesso": true,
  "mensagem": "Descrição da operação",
  "dados": {}
}
```

Erro:

```json
{
  "sucesso": false,
  "mensagem": "Descrição do problema",
  "detalhes": []
}
```

O campo `dados` aparece apenas em respostas bem-sucedidas com conteúdo. O campo `detalhes` aparece apenas quando há mais de um problema a relatar, como em falhas de validação.

## Códigos de status

| Código | Situação |
|---|---|
| 200 OK | Consulta ou atualização realizada com sucesso |
| 201 Created | Usuário cadastrado. O cabeçalho `Location` aponta a URI do novo recurso |
| 204 No Content | Remoção concluída, sem conteúdo a retornar |
| 400 Bad Request | Campos ausentes, com tipo incorreto ou identificador malformado |
| 404 Not Found | Recurso ou rota inexistente |
| 409 Conflict | E-mail já cadastrado para outro usuário |
| 500 Internal Server Error | Falha inesperada. A mensagem é genérica, para não expor detalhes internos |

## Regras de validação

- **nome**: obrigatório, texto, mínimo de 3 caracteres após remoção de espaços
- **email**: obrigatório, texto, formato válido e único no sistema

A comparação de e-mails ignora maiúsculas e minúsculas, e os valores são normalizados antes da gravação, evitando que `Ana@Email.com` e `ana@email.com` sejam tratados como endereços distintos.

Todas as validações ocorrem no servidor, na camada de serviço. Verificações feitas no cliente servem à usabilidade, mas podem ser burladas, e por isso não substituem a checagem no back-end.

## Limitações conhecidas

- A persistência utiliza operações síncronas de arquivo, adequadas ao volume de um MVP, porém inadequadas a um ambiente de produção com concorrência.
- Não há autenticação nem autorização implementadas.
- Os identificadores são numéricos sequenciais, o que seria substituído por UUID em um cenário distribuído.

## Autor

Gabriel Recco Silva

Atividade desenvolvida na disciplina de Desenvolvimento Back-end.
