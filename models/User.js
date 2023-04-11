const knex = require('../database/connection');
const bcrypt = require('bcrypt');

class User {

    async findAll() {
        try {
            const users = await knex.select(["id", "email", "name", "role"]).table("users");
            return users;
        } catch(err) {
            console.log(err);
            return [];
        }
    }

    async findById(id) {
        try {
            const users = await knex.select(["id", "email", "name", "role"]).where({id}).table("users");
            if (users.length > 0) {
                return users[0];
            } else {
                return undefined;
            }
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async findByEmail(email) {
        try {
            const users = await knex.select(["id", "email", "password", "name", "role"]).where({email}).table("users");
            if (users.length > 0) {
                return users[0];
            } else {
                return undefined;
            }
        } catch(err) {
            console.log(err);
            return undefined;
        }
    }

    async new(email, password, name) {
        try {
            const hash = await bcrypt.hash(password, 10);
            await knex.insert({email, password: hash, name, role: 0}).table('users');
        } catch(err) {
            console.log(err);
        }
    }

    async findEmail(email) {
        try {
            const result = await knex.select('*').from('users').where({ email });
            if (result.length == 0) {
                return false;
            } else {
                return true;
            }
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    async update(id, email, name, role) {
        const user = await this.findById(id);

        if (user) {

            let updateUser = {};

            if (email && email != user.email) {
                if (await this.findEmail(email)) {
                    return {status: false, error: "O e-mail já está cadastrado"}
                } else {
                    updateUser.email = email;
                }
            }

            if (name) {
                updateUser.name = name;
            }

            if (role) {
                updateUser.role = role;
            }

            try {
                await knex.update(updateUser).where({id}).table("users");
                return {status: true}
            } catch(error) {
                console.log(error);
                return {status: false, error }
            }

        } else {
            return {status: false, error: "Usuário não existe."};
        }
    }

    async delete(id) {
        const user = await this.findById(id);

        if (user) {

            try {
                await knex.delete().where({id}).table("users");
                return {status: true}
            } catch(err) {
                console.log(err);
                return {status: false, error: err}
            }
        } else {
            return {status: false, error: "Usuário não encontrado"}
        }
    }

    async changePassword(newPassword, id, token) {
        const hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id}).table('users');
        await knex.update({used: 1}).where({id: token.id}).table('tokens');
    }

}

module.exports = new User();