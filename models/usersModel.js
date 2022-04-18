const sequelize = require('../config/database')
const Sequelize = require('sequelize');

const Position = require('./positionsModel')

const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    phone: {
        type: Sequelize.STRING,
        unique: true
    },
    position_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Positions',
            key: 'id'
        }
    },
    photo_filename: {
        type: Sequelize.STRING
    },
    registration_timestamp: {
        type: Sequelize.BIGINT
    }
},{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

User.sync();

module.exports = User;