const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
const app = express();
const port = 9090;


const {MONGOURI} =require('./keys');

app.use(cors());


mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected', ()=>{
    console.log("connected to mongo db")
})
mongoose.connection.on('error', (err)=>{
    console.log("connection to mongo db failed", err)
})



require('./models/user');
require('./models/post');

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))




app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})

//VSSej3Oi12vvcggV
