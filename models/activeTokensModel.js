const sequelize = require('../config/database')
const Sequelize = require('sequelize');

const ActiveToken = sequelize.define('ActiveToken', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: Sequelize.STRING,
        unique: true
    }
},{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

ActiveToken.sync();

module.exports = ActiveToken;