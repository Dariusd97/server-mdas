const { DataTypes } = require('sequelize');

const { sequelize } = require("/Users/dadobre/Desktop/server-mdas/database.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const ShoppingItem = sequelize.define("shoppingItems", {
        totalPrice: {
            type: Sequelize.DOUBLE,
        },
        quantity: {
            type: Sequelize.INTEGER,
        },
        title: {
            type: Sequelize.STRING(255)
        },
        authors: {
            type: Sequelize.STRING(255)
        },
        imageBook: {
            type: Sequelize.STRING(255)
        },
        initialPrice: {
            type: Sequelize.STRING(255)
        }

    });
    return ShoppingItem;
}