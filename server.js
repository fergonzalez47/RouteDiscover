const mongoose = require("mongoose");
const path = require('path');
const express = require('express');
const app = express();
const { connectDB } = require('./db/dbconnection');

const cors = require('cors');
const exphbs = require("express-handlebars").create({ defaultLayout: 'main', extname: '.hbs' });
const passport = require("passport");
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const errorHandler = require("./helpers/errorHandler");

// // swaggerAutogen
const swaggerAutogen = require('swagger-autogen')();

// Handlebars
app.engine('.hbs', exphbs.engine);
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')));



//Express session

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));


//flash

app.use(flash());

//Las siguientes lineas son Middleware que sirven para analizar
//los cuerpos JSON que se envian. Otra opción es usar Body-Parser, de la misma forma.
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cors());
connectDB();


const port = process.env.port || 3000;

app.use(errorHandler);
app.use("/", require("./routes/index"));
app.use("/", require('./routes//path.js'));


app.listen(port);
console.log("Web server is listening at port ", port);
