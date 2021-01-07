const express = require("express");
const bodyParser = require('body-parser')

const app = express();

const port = process.env.PORT || 3000

const userRoutes = require('./routes/userRoute.js')

app.use(bodyParser.json());
app.use("/user", userRoutes)

app.listen(8081, () => { console.log('Server is running on port 8081')})

module.exports = app;