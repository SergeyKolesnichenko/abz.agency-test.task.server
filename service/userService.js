const userModel = require('../models/usersModel')
const positionService = require('../service/positionService')
const paginationService = require('../service/paginationService')
const ApiError = require("../exceptions/apiError");

class UserService{

    async getAllUsersByOffset(link, limit, offset) {

        let result = await paginationService.getDataByOffset(userModel, limit, offset, 'id')

        if(result.page > result.total_pages)
            throw new ApiError(404, 'Invalid offset')

        result.total_users = result.total_count
        delete result.total_count

        result.users = result.rows
        delete result.rows

        result.links = paginationService.createLinks(link, result.page, result.total_pages, limit)

        return result
    }

    async getAllUsersByPage(link, limit, page) {

        let result = await paginationService.getDataByPage(userModel, page, limit, 'id')

        if(page > result.total_pages)
            throw new ApiError(404, 'Page not found')

        result.total_users = result.total_count
        delete result.total_count

        result.users = result.rows
        delete result.rows

        result.links = paginationService.createLinks(link, result.page, result.total_pages, limit)

        return result
    }

    async postUser(user) {
        await userModel.sync();
        user.registration_timestamp = Date.now()

        const position = await positionService.getPositionById(user.position_id)

        try {
            return await userModel.create(user)
        }catch (e) {
            throw new ApiError(409, 'User with this phone or email already exist')
        }
    }

    async getUserByID(id) {
        await userModel.sync();
        const candidate = await userModel.findOne({ id })

        if(!candidate)
            return null;

        let position = await positionService.getPositionById(candidate.position_id)

        let result = {
            id: candidate.id,
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            position: position.name,
            position_id: candidate.position_id,
            photo: candidate.photo_filename
        }

        return result
    }

    async getAllUsingImages() {
        await userModel.sync();
        const candidate = await userModel.findAll({attributes: ['photo_filename']})

        return candidate.map((i) => i.photo_filename)
    }
}

module.exports = new UserService();