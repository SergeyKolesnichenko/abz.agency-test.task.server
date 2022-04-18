const tokenService = require('../service/tokenService')

class TokenController{
    async createToken(req, res, next){
        try{
            const token = tokenService.generateToken({})
            tokenService.saveToken(token)

            return res.status(200).json({
                success: true,
                token
            })
        }catch (e){
            next(e);
        }
    }
}

module.exports = new TokenController();