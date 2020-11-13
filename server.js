const express = require("express");
const bodyParser = require('body-parser')

const app = express();

const port = process.env.PORT || 3000

const userRoutes = require('/Users/dadobre/Desktop/server-mdas/routes/userRoute.js')

app.use(bodyParser.json());
app.use("/user", userRoutes)

app.listen(8082, () => { console.log('Server is running on port 8081')})

module.exports = app;