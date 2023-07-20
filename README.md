# users-api
API de gestão de usuários, com sistema de login e token de recuperação de senha.<br/>
Projeto criado para praticar conceitos REST, middlewares e controllers.

### O que foi utilizado?
- Express
- Bcrypt
- JWT
- MySQL
- Knex
- Nodemailer

-------------------------------------------------------------------

## Endpoints - Usuários
Todas as rotas estão protegidas por autenticação com JWT.
### POST /user
**Parâmetros**
- Recebe um JSON com {email, name, password} (strings) e cria um usuário no banco de dados, caso não haja um com o mesmo e-mail.

**Respostas**
- Status 400 se *email, name* ou *password* forem inválidos;
- Status 406 se já houver usuário com e-mail fornecido;
- Status 200 se criação ocorrer com sucesso.

**Obs.:** Inicialmente, essa rota não possui middleware de autenticação, para facilitar criação do usuário master no banco de dados. É ideal que, após criados os usuários admins, adicione o middleware "auth" na rota.

### GET /user
**Parâmetros**
- Não recebe parâmetros.

**Respostas**
- Retorna todos os usuários cadastrados no banco de dados.

### GET /user/:id
**Parâmetros**
- Recebe o id do usuário pela url.

**Respostas**
- Retorna o usuário com o id recebido;
- Se não existir, retorna o status 404 e um JSON com mensagem de erro.

### PUT /user
**Parâmetros**
- Recebe um JSON {id, name, email, role}.

**Respostas**
- Status 406 se recebeu algum campo inválido e não pôde atualizar o usuário;
- Status 200 se o usuário foi atualizado com sucesso.

### DELETE /user/:id
**Parâmetros**
- Recebe o id do usuário pela url.

**Respostas**
- Status 404 se o usuário não foi encontrado pelo id;
- Status 200 se o usuário foi excluído com sucesso.
------------------------------------------------------------------------------
## Endpoints - Login

### POST /login
**Parâmetros**
- Recebe um JSON {email, password}.

**Respostas**
- Caso e-mail e senha estejam corretos, retorna um JSON com o campo *token*, contendo o JWT;
- Status 400 caso usuário não existe ou email/senha esteja incorreto.

-----------------------------------------------------------------------------
## Endpoints - Recuperação de Senha

### POST /recover
**Parâmetros**
- Recebe um JSON {email};

**Respostas**
- Status 406 se não houver usuário com aquele e-mail;
- Status 500 caso não consiga enviar token para o e-mail indicado;
- Status 200 caso token seja enviado para o e-mail do usuário com sucesso.

### PUT /changepassword
**Parâmetros**
- Recebe um JSON {token, password} (token recebido no e-mail, nova senha).

**Respostas**
- Status 406 caso token seja inválido;
- Status 200 caso senha seja atualizada com sucesso.
