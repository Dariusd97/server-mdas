const { DataTypes } = require('sequelize');

const { sequelize } = require("/Users/dadobre/Desktop/server-mdas/database.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const FavoriteItem = sequelize.define('favoriteItems', {
        title: {
            type: Sequelize.STRING(255)
        },
        author: {
            type: Sequelize.STRING(255)
        },
        publishDate: {
            type: Sequelize.STRING(255)
        },
        category: {
            type: Sequelize.STRING(255)
        },
        image: {
            type: Sequelize.STRING(255)
        },
        price: {
            type: Sequelize.DOUBLE
        }
    });
    return FavoriteItem;
}