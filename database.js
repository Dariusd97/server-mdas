const Sequelize = require("sequelize")

const database = process.env.database || 'mdas'
const username = process.env.username || 'root'
const password = process.env.password || 'hpq19061997'
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
    User : require('/Users/dadobre/Desktop/server-mdas/models/user')(sequelize),
}


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