const positionService = require('../service/positionService')
const ApiError = require("../exceptions/apiError");
const {validationResult} = require("express-validator");
const validationMapService = require("../service/validationMapService");
const fakerService = require("../service/fakerService");

class PositionsController{
    async getAllPositions(req, res, next){
        try{
            const positions = await positionService.getAllPositions()

            if(positions.length === 0)
                return next(new ApiError(422, 'Positions not found'))

            return res.status(200).json({
                success: true,
                positions
            })
        }catch (e){
            next(e);
        }
    }

    async addPosition(req, res, next){
        try{
            const { position } = req.body
            const result = await positionService.addPosition(position)

            if(!result) {
                return next(new ApiError(423, 'Position already exists.'))
            }

            return res.status(200).json({
                success: true
            })
        }catch (e) {
            next(e);
        }
    }

    async generatePositions(req, res, next) {
        try{
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return next(new ApiError(400, 'Validation failed', validationMapService.mapErrors(errors.errors)))
            }

            const { count } = req.query
            await fakerService.createFakePositions(count)

            return res.status(200).json({
                success: true
            })

        } catch (e) {
            next(e)
        }
    }
}

module.exports = new PositionsController();