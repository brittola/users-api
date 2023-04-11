const jwt = require('jsonwebtoken');
const secret = require('../secret/secret');

module.exports = (req, res, next) => {

    const authToken = req.headers['authorization'];

    if (authToken) {
        const token = authToken.split(' ')[1];

        try {
            const decoded = jwt.verify(token, secret);

            if (decoded.role == 0) {
                res.status(403);
                res.send("Você não tem cargo suficiente para acessar essa rota");
            } else {
                next();
            }
        } catch(err) {
            res.status(403);
            res.send('Token JWT inválido.');
        }

    } else {
        res.status(403);
        res.send('Você não está autenticado.');
    }

}