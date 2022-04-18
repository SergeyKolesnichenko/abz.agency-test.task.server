require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors')

const mainRouter = require('./routers/mainRouter')
const errorMiddleware = require('./middlewares/errorMiddleware');

const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(express.static(__dirname));
app.use(express.json());
app.use('/api/v1', mainRouter);
app.use(errorMiddleware);

const start = async () =>{
    try{
        app.listen(PORT, () => console.log('Server has been started!'));
    }catch(e){
        console.log(e);
    }
}

start();