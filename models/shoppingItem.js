const { DataTypes } = require('sequelize');

const { sequelize } = require("/Users/dadobre/Desktop/server-mdas/database.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const ShoppingItem = sequelize.define("shoppingItems", {
        price: {
            type: Sequelize.DOUBLE,
        },
        quantity: {
            type: Sequelize.INTEGER,
        },
        title: {
            type: Sequelize.STRING(255)
        },
        author: {
            type: Sequelize.STRING(255)
        },
        image: {
            type: Sequelize.STRING(255)
        }
    });
    return ShoppingItem;
}