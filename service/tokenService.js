const jwt = require('jsonwebtoken')
const tokenModel = require('../models/activeTokensModel')

class TokenService{
    generateToken(payload) {
        const token = jwt.sign(payload, process.env.TOKEN_KEY, {expiresIn: 60 * 40});
        return token;
    }

    validateToken(token) {
        try{
            const result = jwt.verify(token, process.env.TOKEN_KEY);
            return result;
        }catch (e){
            return null;
        }
    }

    async isTokenContains(token) {
        await tokenModel.sync();
        let result = await tokenModel.findOne({ where: { token }});

        return result != null;
    }

    saveToken(token) {
        tokenModel.sync().then(()=>{
            tokenModel.create({ token })
        })
    }

    removeToken(token) {
        tokenModel.sync().then(()=>{
            tokenModel.destroy({ where: { token } })
        })
    }

    removeExpiredTokens() {
        tokenModel.sync().then(()=>{
            tokenModel.findAll().then((tokens)=>{
                for(let token of tokens) {
                    if(!this.validateToken(token)) {
                        tokenModel.destroy( { where: { token } } );
                    }
                }
            })
        })
    }
}

module.exports = new TokenService();