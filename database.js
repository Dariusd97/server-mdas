const Sequelize = require("sequelize")

const database = process.env.database || 'mdas'
const username = process.env.username || 'root'
const password = process.env.password || '12345678'
const hostname = process.env.hostname || 'localhost'

const sequelize = new Sequelize(database, username, password, {
    host : hostname,
    dialect : 'mysql',
    pool: {
        max: 5,
        min: 0,
  }
})

const tables = {
    User : require('./models/user')(sequelize),
    ShoppingItem: require('./models/shoppingItem')(sequelize),
    FavoriteItem: require('./models/favoriteItem')(sequelize)
}

tables.User.hasMany(tables.ShoppingItem);
tables.User.hasMany(tables.FavoriteItem);

sequelize.sync()
    .then()
    .catch((error) => console.warn(error))
    
sequelize
    .authenticate()
    .then(() => {
        console.warn('Connection has been established successfully.')
    })
    .catch(error => {
        console.warn('Unable to connect to the database.',error)
    })
    
module.exports = {
    tables :tables,
    sequelize : sequelize
}