const Router = require("router")
const database = require("/Users/dadobre/Desktop/server-mdas/database.js")
const router = Router()
const { sequelize } = require("/Users/dadobre/Desktop/server-mdas/database.js");
const DataTypes = sequelize.DataTypes;
const tables = database.tables

const bcrypt = require('bcrypt');
const saltRounds = 10;


//create one user
router.post('/create', async(req, res, next) => {
    try {
        if (req.body.username && req.body.username !== null && req.body.username !== '' && req.body.password && req.body.password !== null && req.body.password !== '') {
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
                        res.status(200).json({
                            Message: "User exists",
                            statusCode: 200

                        })
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

// create list
router.post('/:userEmail/createList', async(req, res, next) => {
    try {
        await tables['User'].findOne({
            where: {
                username: req.params.userEmail
            }
        }).then(user => {
            if (user) {
                tables['List'].create({ name: req.body.name, userId: user.id })
                    .then(() => {
                        res.status(200).json({ Message: "Resource created" })
                    })
                    .catch(err => {
                        console.warn(err)
                        res.status(500).json({ Message: "Server error" })
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

// get all list of one user
router.get("/:userEmail/getAllLists", async(req, res, next) => {
    try{
        await tables['User'].findOne({
            where : {
                username : req.params.userEmail
            }
        }).then(user => {
            if(user){
                tables['List'].findAll({
                    where : {
                        userId : user.id    
                    }
                }).then(lists => {
                    if(lists){
                        res.status(200).json({lists : lists})
                    }else{
                        res.status(404).json({Message : "Resource doesn't exists"})
                    }
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

// add product to list
router.post('/:userEmail/addProduct/:listId/:productId', async(req, res, next) => {
    try {
        await tables['User'].findOne({
            where: {
                username: req.params.userEmail
            }
        }).then(user => {
            if (user) {
                tables['List'].findByPk(req.params.listId)
                    .then(list => {
                        if (list) {
                            tables['RowListLaptop'].create({ listId: list.id, laptopId: req.params.productId })
                                .then(() => {
                                    res.status(200).json({ Message: "Resource created" })
                                })
                                .catch(err => {
                                    console.warn(err)
                                    res.status(500).json({ Message: "Server error" })
                                })
                        }
                        else {
                            res.status(404).json({ Message: "List doesn't exists" })
                        }
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

// delete product from list
router.delete("/:userEmail/removeProduct/:listId/:productId", async(req, res, next) => {
    await tables['User'].findOne({
        where : {
            username : req.params.userEmail
        }
    }).then(user => {
        if(user){
            tables['List'].findByPk(req.params.listId)
                .then(list => {
                    if(list){
                        tables['RowListLaptop'].destroy({where : {listId: list.id, laptopId: req.params.productId}})
                            .then(() => {
                                res.status(200).json({Message : "Resource deleted"})
                            })
                    }else{
                        res.status(404).json({Message : "List doesn't exists"})
                    }
                })
        }else{
            res.status(404).json({Message : "Username doesn't exists"});
        }
    })
})


// create list and add product to it
router.post('/:userEmail/createList/addProduct/:productId', async(req, res, next) => {
    try {
        await tables['User'].findOne({
            where: {
                username: req.params.userEmail
            }
        }).then(user => {
            if (user) {
                tables['List'].create({name : req.body.name, userId : user.id})
                    .then(list => {
                        tables['RowListLaptop'].create({ listId: list.id, laptopId: req.params.productId })
                                .then(() => {
                                    res.status(200).json({ Message: "Resource created" })
                                })
                                .catch(err => {
                                    console.warn(err)
                                    res.status(500).json({ Message: "Server error" })
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

// delete list from user
router.delete('/:userEmail/:listId', async(req, res, status) => {
    try {
        await tables['User'].findOne({
            where : {
                username : req.params.userEmail
            }
        }).then(user => {
            if(user){
                tables['List'].findOne({where : {userId : user.id , id : req.params.listId}}, {include : [{model : tables['Laptop']}]} ).then(list => {
                    if(list){
                        list.destroy();
                        res.status(200).json({Message : "Succes"})
                    }else{
                        res.status(404).json({Message : "List doesn't exists"})
                    }
                })
            }else{
                res.status(404).json({Message : "Username doesn't exists"})
            }
        })
    }
    catch (error) {
        console.warn(error);
        res.status(500).json({ Message: "Server error" })
    }
})


async function sendMail(toEmail) {
    var data = {
        from: "My Nodejs Application <postmaster@sandbox433482a392a049d290753ae57509a2e6.mailgun.org>",
        to: `<${toEmail}>`,
        subject: 'Test Mail',
        text: 'You are truly awesome!'
    };

    mailgun.messages().send(data, function(error, body) {
        console.log(body);
    });
}

module.exports = router