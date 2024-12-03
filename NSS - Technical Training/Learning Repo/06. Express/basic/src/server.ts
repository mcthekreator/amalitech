const express = require("express");
const cors = require("cors");
const app = express()
require("dotenv").config();

const connectDB = require("./db/connect");
const router = require("./routes/users.route")


app.use(express.json());
app.use(cors());


const start = () => {
    try{
        connectDB(process.env.DB_URL);
        app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}...`));
    }catch(error){
        console.log("unable to connect to database");
        
    }
};

start();