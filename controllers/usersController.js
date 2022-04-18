const userService = require('../service/userService')
const { validationResult } = require('express-validator')

const validationMapService = require('../service/validationMapService')
const ApiError = require("../exceptions/apiError");
const positionService = require("../service/positionService");
const fakerService = require("../service/fakerService")

class UsersController{
    async getUsers(req, res, next) {
        try{
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return next(new ApiError(422, 'Validation failed', validationMapService.mapErrors(errors.errors)))
            }

            const { page, offset, count } = req.query

            if(offset < -1)
                return next(new ApiError(404, 'Invalid offset'))

            let current_link = `${req.protocol}://${req.get('host')}${req.originalUrl}`.split('?')[0]
            let result;

            if(offset !== -1)
                result = await userService.getAllUsersByOffset(current_link, count, offset)
            else
                result = await userService.getAllUsersByPage(current_link, count, page)

            const arr = []

            for(let i of result.users){
                let position = { name: 'not found' }

                try {
                    position = await positionService.getPositionById(i.position_id)
                }catch (e){

                }

                arr.push({
                    id: i.id,
                    name: i.name,
                    email: i.email,
                    position_id: i.position_id,
                    position: position.name,
                    registration_timestamp: i.registration_timestamp,
                    photo: `${req.protocol}://${req.get('host')}/images/users/${i.photo_filename}`
                })
            }

            result.users = arr
            result.success = true

            return res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }

    async postUser(req, res, next) {
        try{
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return next(new ApiError(422, 'Validation failed', validationMapService.mapErrors(errors.errors)))
            }

            const { name, email, phone, position_id } = req.body;
            const dto = { name, email, phone, position_id, photo_filename: req.file.filename }

            const result = await userService.postUser(dto)

            return res.status(200).json({
                success: true,
                user_id: result.id,
                message: 'New user successfully registered'
            })
        } catch (e) {
            next(e)
        }
    }

    async getUserByID(req, res, next) {
        try{
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return next(new ApiError(400, 'Validation failed', validationMapService.mapErrors(errors.errors)))
            }

            const { id } = req.params;
            const user = await userService.getUserByID(id)

            if(!user) {
                let errors = { user_id: [ 'User not found' ] }
                return next(new ApiError(404, 'The user with the requested identifier does not exist', errors))
            }

            user.photo = `${req.protocol}://${req.get('host')}/images/users/${user.photo}`

            return res.status(200).json({
                success: true,
                user
            })
        } catch (e) {
            next(e)
        }
    }

    async generateUsers(req, res, next) {
        try{
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return next(new ApiError(400, 'Validation failed', validationMapService.mapErrors(errors.errors)))
            }

            const { count } = req.query
            await fakerService.createFakeUsers(count)

            return res.status(200).json({
                success: true
            })

        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UsersController();