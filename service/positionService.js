const positionModel = require('../models/positionsModel')
const ApiError = require("../exceptions/apiError");

class PositionService{
    async getAllPositions() {
        await positionModel.sync();
        const queryResult = await positionModel.findAll();

        const result = []

        for(let i of queryResult) {
            result.push({
                id: i.id,
                name: i.name
            })
        }

        return result
    }

    async getPositionById(id) {
        try {
            await positionModel.sync();
            const queryResult = await positionModel.findOne({where: { id }});
            return queryResult;
        } catch (e) {
            throw new ApiError(422, 'Position does not exists.');
        }
    }

    async addPosition(name) {
        await positionModel.sync()
        await positionModel.create({name})
    }
}

module.exports = new PositionService();