const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secret = require('../secret/secret');

// estas configurações de transporter são para um e-mail outlook/hotmail
const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "", //e-mail
        pass: "" //senha
    },
    tls: {
        ciphers:'SSLv3'
    }
});

class UserController {
    async index(req, res) {
        const users = await User.findAll();

        res.json(users);
    }

    async findUser(req, res) {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (user) {
            res.json(user);
            return;
        } else {
            res.status(404);
            res.json({error: "Usuário não existe."});
        }
    }

    async create(req, res) {
        const {name, email, password} = req.body;

        if (name && email && password) {

            if (name.length < 3 || typeof name != 'string') {
                res.status(400);
                res.json({error: "Nome inválido."});
                return;
            }

            if (email.length < 11 || typeof email != 'string') {
                res.status(400);
                res.json({error: "E-mail inválido."});
                return;
            }

            if (password.length < 8 || typeof password != 'string') {
                res.status(400);
                res.json({error: "Senha inválida."});
                return;
            }

            if (await User.findEmail(email)) {
                res.status(406);
                res.json({error: "Usuário já cadastrado."});
                return;
            }

            await User.new(email, password, name);

            res.sendStatus(200);

        } else {
            res.status(400);
            res.json({error: "Algum dos dados faltando."});
        }
    }

    async edit(req, res) {
        const {id, name, email, role} = req.body;

        const result = await User.update(id, email, name, role);

        if (result.status) {
            res.sendStatus(200);
        } else {
            res.status(406);
            res.json({error: result.error});
        }
    }

    async remove(req, res) {
        const {id} = req.params;

        const result = await User.delete(id);

        if (result.status) {
            res.sendStatus(200);
        } else {
            res.status(404);
            res.json({error: result.error});
        }
    }

    async recoverPassword(req, res) {
        const {email} = req.body;

        const result = await PasswordToken.create(email);

        if (result.status) {
            const mail = {
                from: "Gabriel Rodrigues <gabriel.rodrigues.brito@hotmail.com>",
                to: email,
                subject: "Recuperar minha senha",
                text: "",
                html: `Aqui está o seu token de recuperação de senha.<br><h2>${result.token}</h2><br>Para utilizá-lo, basta enviar um json com os campos "token" e "password",<br>informando o token recebido e a nova senha, respectivamente, para a rota:<br> PUT http://localhost:8686/changepassword`
            };

            transporter.sendMail(mail, (err, msg) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    console.log(msg);
                    res.send("Confira a caixa de entrada do email " + email);
                }
            });

        } else {
            res.status(406);
            res.json({error: result.error});
        }
    }

    async changePassword(req, res) {
        const {token, password} = req.body;

        const result = await PasswordToken.validate(token);

        if (result.status) {
            await User.changePassword(password, result.token.user_id, result.token);
            res.send("Senha alterada");
        } else {
            res.status(406);
            res.send("Token inválido");
        }
    }

    async login(req, res) {
        const {email, password} = req.body;

        const user = await User.findByEmail(email);

        if (user) {
            const correct = await bcrypt.compare(password, user.password);

            if (correct) {
                const token = jwt.sign({email: user.email, role: user.role}, secret);
                res.json({token});
            } else {
                res.status(400);
                res.send("E-mail ou senha incorreta.");
            }

        } else {
            res.sendStatus(400);
        }
    }
}

module.exports = new UserController();