const { DataTypes } = require('sequelize');

const { sequelize } = require("/Users/dadobre/Desktop/server-mdas/database.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const FavoriteItem = sequelize.define('favoriteItems', {
        title: {
            type: Sequelize.STRING(255)
        },
        authors: {
            type: Sequelize.STRING(255)
        },
        publishedDate: {
            type: Sequelize.STRING(255)
        },
        categories: {
            type: Sequelize.STRING(255)
        },
        thumbnail: {
            type: Sequelize.STRING(255)
        },
        price: {
            type: Sequelize.STRING(255)
        },
        description: {
            type: Sequelize.TEXT 
        },
        buy: {
            type: Sequelize.STRING(255)
        },
        preview: {
            type: Sequelize.STRING(255)
        },
        url: {
            type: Sequelize.STRING(255)
        },
        pageCount: {
            type: Sequelize.INTEGER
        }
    });
    return FavoriteItem;
}