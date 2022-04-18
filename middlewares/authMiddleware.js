const tokenService = require('../service/tokenService')
const ApiError = require('../exceptions/apiError')

module.exports = async (req, res, next) => {
    try{
        const token = req.headers.token;

        if(!token){
            return next(new ApiError(401, 'Missing token.'))
        }

        if(!tokenService.validateToken(token)){
            return next(new ApiError(401, 'The token expired.'))
        }

        if(!await tokenService.isTokenContains(token)){
            return next(new ApiError(401, 'The token has already used.'))
        }

        tokenService.removeToken(token)

        next()
    }catch (e) {
        next(e)
    }
}