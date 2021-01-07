
const { DataTypes } = require('sequelize');

const { sequelize } = require("../database.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        username : {
            type: Sequelize.STRING(255),
            allowNull : false,
            validate : {
                isEmail : true
            }
        },
        password : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        name : {
            type: Sequelize.STRING(255)
        },
        address : {
            type: Sequelize.STRING(255)
        },

    })
    return User
}