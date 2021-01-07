const Router = require("router")
const database = require("../database.js")
const router = Router()
const { sequelize } = require("../database.js");
const DataTypes = sequelize.DataTypes;
const tables = database.tables

const bcrypt = require('bcrypt');
const saltRounds = 10;


// create one user
router.post('/create', async(req, res, next) => {
    try {
        if (req.body.username && req.body.username !== null && 
            req.body.username !== '' && 
            req.body.password && 
            req.body.password !== null && 
            req.body.password !== '') {
            let response = await tables.User.findOne({ where: { username: req.body.username } })
            if (response == null) {
                const passwordHash = bcrypt.hashSync(req.body.password, saltRounds);
                await tables['User'].create({ 
                    username: req.body.username, 
                    password: passwordHash , 
                    name: req.body.name, 
                    address: req.body.address
                })
                res.status(201).json({
                    Message: "Resource created",
                    statusCode: 201
                })
            }
            else {
                res.status(409).json({
                    Message: "User already exists",
                    statusCode: 409
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// check is user exists
router.get("/login", async(req, res, next) => {
    try {
        if (Object.entries(req.query).length != 0 && req.query.username !== undefined && req.query.username !== '' && req.query.password !== undefined && req.query.password !== '') {
            await tables['User'].findOne({
                where: { username: req.query.username }
            }).then(user => {
                if (user) {
                    const existsPasswordMatch = bcrypt.compareSync(req.query.password, user['dataValues']['password'])
                    if (existsPasswordMatch) {
                        res.status(200).json(user)
                    }
                    else {
                        res.status(404).json({
                            Message: "Incorrect username or password",
                            statusCode: 404
                        })
                    }
                }
                else {
                    res.status(404).json({
                        Message: "Incorrect username or password",
                        statusCode: 404
                    })
                }
            })
        }
        else {
            res.status(400).json({ Message: "Bad request" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// update user password
router.get('/recoverPassword', async(req, res, next) => {
    try {
        if (req.query && req.query.username !== null && req.query.username !== '' && req.query.password && req.query.password !== null && req.query.password !== '') {
            await tables['User'].findOne({
                where: {
                    username: req.query.username
                }
            }).then(user => {
                if (user) {
                    const passwordHash = bcrypt.hashSync(req.query.password, saltRounds);
                    user.update({ password: passwordHash }).then(() => {
                        sendMail(req.query.username)
                        res.status(200).json({
                            Message: "Password updated",
                            statusCode : 200
                            })
                    })
                }
                else {
                    res.status(404).json({ 
                        Message: "Username doesn't exists",
                        statusCode: 404
                    })
                }
            })
        }
        else {
            res.status(400).json({ Message: "Bad request" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// get all shopping items of one user from shopping list
router.get("/:userEmail/shoppingItem", async(req, res, next) => {
    try{
        await tables['User'].findOne({
            where : {
                username : req.params.userEmail
            }
        }).then(user => {
            if(user){
                tables.ShoppingItem.findAll({
                    where: {
                        userId : user.id
                    }
                }).then(items => {
                    let array = [];
                    for (var i = 0 ; i < items.length; i++) {
                        array.push(items[i].dataValues)
                    }                    
                    res.status(200).json(array);
                })
            }else{
                res.status(404).json({Message : "Username doesn't exists"})
            }
        })
    }catch(error){
        console.warn(error)
        res.status(500).json({Message : "Server error"})
    }
})

// get all favorite items of one user from favorite list
router.get("/:userEmail/favoriteItem", async(req, res, next) => {
    try{
        await tables['User'].findOne({
            where : {
                username : req.params.userEmail
            }
        }).then(user => {
            if(user){
                tables.FavoriteItem.findAll({
                    where: {
                        userId : user.id
                    }
                }).then(items => {
                    let array = [];
                    for (var i = 0 ; i < items.length; i++) {
                        array.push(items[i].dataValues)
                    }                    
                    res.status(200).json(array);
                })
            }else{
                res.status(404).json({Message : "Username doesn't exists"})
            }
        })
    }catch(error){
        console.warn(error)
        res.status(500).json({Message : "Server error"})
    }
})

// update user settings 
router.put("/:userEmail/userInfo", async(req, res, next) => {
    try{
        await tables['User'].findOne({
            where : {
                username : req.params.userEmail
            }
        }).then(async(user) => {
            if(user){
                user.update({
                    username: req.body.username,
                    name: req.body.name,
                    address: req.body.address
                });
                res.status(200).json(user)
            }else{
                res.status(404).json({Message : "Username doesn't exists"})
            }
        })
    }catch(error){
        console.warn(error)
        res.status(500).json({Message : "Server error"})
    }
})

// add shopping item to shopping list
router.post('/:userEmail/shoppingItem/add', async(req, res, next) => {
    try {
        await tables['User'].findOne({
            where: {
                username: req.params.userEmail
            }
        }).then(user => {
            if (user) {
                tables.ShoppingItem.create({
                    totalPrice: req.body.totalPrice,
                    quantity: req.body.quantity,
                    title: req.body.title,
                    authors: req.body.authors,
                    imageBook: req.body.imageBook,
                    initialPrice: req.body.initialPrice,
                    userId: user.id
                }).then(() => {
                    res.status(200).json({ Message: "Resource created" })
                });
            }
            else {
                res.status(404).json({ Message: "Username doesn't exists" })
            }
        })
    }
    catch (error) {
        console.warn(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// add favorite item to favoriteItem list
router.post('/:userEmail/favoriteItem/add', async(req, res, next) => {
    try {
        await tables['User'].findOne({
            where: {
                username: req.params.userEmail
            }
        }).then(user => {
            console.lo
            if (user) {
                console.log(req.body)
                tables.FavoriteItem.create({
                    title: req.body.title,
                    authors: req.body.authors,
                    thumbnail: req.body.thumbnail,
                    publishedDate: req.body.publishedDate,
                    price: req.body.price,
                    description: req.body.description,
                    userId: user.id
                }).then(() => {
                    res.status(200).json("Resource created")
                });
            }
            else {
                res.status(404).json({ Message: "Username doesn't exists" })
            }
        })
    }
    catch (error) {
        console.warn(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// update multiple shopping items to shopping list
router.put('/:userEmail/shoppingItem/updateAll', async(req, res, next) => {
    try {
        await tables['User'].findOne({
            where: {
                username: req.params.userEmail
            }
        }).then(async(user) => {
            if (user) {
                let list = req.body
            
                for(var j = 0; j < list.length; j++) {
                    await tables.ShoppingItem.findOne({where: {title: list[j].title}}).then(item => {
                        item.update({
                            quantity: list[j].quantity,
                            totalPrice: list[j].totalPrice
                        });
                    });
                }
                res.status(200).json(list)
                
            }
            else {
                res.status(404).json({ Message: "Username doesn't exists" })
            }
        })
    }
    catch (error) {
        console.warn(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// delete shopping item from shopping list
router.delete("/:userEmail/shoppingItem/remove/:itemTitle", async(req, res, next) => {
    await tables['User'].findOne({
        where : {
            username : req.params.userEmail
        }
    }).then(user => {
        if(user){
            console.log("Delete shopping item")
            tables.ShoppingItem.destroy({
                where: {
                    title: req.params.itemTitle
                }
            }).then(() => {
                res.status(200).json("Resource deleted")
            })

        }else{
            res.status(404).json({Message : "Username doesn't exists"});
        }
    })
})

// delete favorite item from favorite list
router.delete("/:userEmail/favoriteItem/remove/:itemTitle", async(req, res, next) => {
    await tables['User'].findOne({
        where : {
            username : req.params.userEmail
        }
    }).then(user => {
        if(user){
            console.log("Delete favorite item")
            tables.FavoriteItem.destroy({
                where: {
                    title: req.params.itemTitle
                }
            }).then(() => {
                res.status(200).json("Resource deleted")
            })

        }else{
            res.status(404).json({Message : "Username doesn't exists"});
        }
    })
})

// get all lists and products for one user
router.get('/:userEmail/lists', async(req, res, next) => {
    try {
        await tables['User'].findOne({
            where: {
                username: req.params.userEmail
            }
        }).then(user => {
            if (user) {
                tables['List'].findAll({
                    where: {
                        userId: user.id
                    },
                    include: [{
                        model: tables['Laptop'],
                        include: [{
                            model: tables['PriceHistoryLaptop']
                        }]
                    }]
                }).then(lists => {
                    res.status(200).json({
                        lists: lists
                    })
                })
            }
            else {
                res.status(404).json({ Message: "Username doesn't exists" })
            }
        })
    }
    catch (error) {
        console.warn(error)
        res.status(500).json({ Message: "Server error" })
    }
})

module.exports = router