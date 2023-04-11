const bcrypt = require('bcrypt');
const knex = require('../database/connection');
const User = require('./User');

class PasswordToken {

    async create(email) {
        const user = await User.findByEmail(email);

        if (user) {
            const token = Date.now();

            try {
                await knex.insert({
                    user_id: user.id,
                    used: 0, // false
                    token
                }).table('tokens');

                return {status: true, token}
            } catch(err) {
                console.log(err);
                return {status: false, error: err}
            }
        } else {
            return {status: false, error: "Usuário não encontrado."}
        }
    }

    async validate(token) {
        try {
            const result = await knex.select("*").where({token}).table("tokens");

            if (result.length > 0) {
                if (result[0].used > 0) {
                    return false;
                } else {
                    return {status: true, token: result[0]};
                }
            } else {
                return false;
            }

        } catch(err) {
            console.log(err);
            return false;
        }
        
    }

}

module.exports = new PasswordToken();