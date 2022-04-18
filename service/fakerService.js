const usersService = require('../service/userService')
const positionsService = require('../service/positionService')
const { faker } = require('@faker-js/faker')

const tinify = require('../config/tinifyImage')

const https = require('https');
const fs = require('fs');
const path = require("path");

class FakerService {
    async createFakePositions(count) {
        for (let i = 0; i < count; i++) {
            let job = faker.name.jobType()
            await positionsService.addPosition(job)
        }
    }

    async createFakeUsers(count) {
        let positions = await positionsService.getAllPositions();
        let positions_ids = positions.map(x => x.id)

        let file_list = []

        for (let i = 0; i < count; i++) {
            let name = faker.name.findName()
            let email = faker.internet.email(name)
            let phone = faker.phone.phoneNumber('380#########')

            let position_id = faker.random.arrayElement(positions_ids)
            let photo_link = faker.image.avatar()
            let photo_filename = Date.now().toString() + '.jpg'

            file_list.push(photo_filename)

            const file = fs.createWriteStream(path.join(__dirname, '../images/users/', photo_filename));
            const request = https.get(photo_link, function(response) {
                response.pipe(file);
            });

            usersService.postUser({name, email, phone, position_id, photo_filename})
        }
    }
}

module.exports = new FakerService();