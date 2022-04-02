const express = require('express');
const app = express();
const connection = require('./util/database');
require('dotenv').config()
const port = process.env.PORT || 4000;
const cors = require('cors');
app.use(cors())

const AuthController = require('./Routes/routes.js');
app.use('/api/auth', AuthController);
// app.get('/fake',(req,res)=>res.status(200).json({ msg : 'worked'}));


app.listen(port,() => {
    console.log(`Running on port ${port}`)
})