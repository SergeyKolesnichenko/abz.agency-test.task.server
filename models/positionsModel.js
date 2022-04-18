const sequelize = require('../config/database')
const Sequelize = require('sequelize');

const Position = sequelize.define('Position', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    }
},{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

Position.sync();

module.exports = Position;