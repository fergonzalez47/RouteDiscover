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


// Pasport 

require('./passport.js')(passport);


// // swaggerAutogen
const swaggerAutogen = require('swagger-autogen')();

// Handlebars
app.engine('.hbs', exphbs.engine);
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')));



//Express session

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //A mi me funcionó, por la version mas reciente hacerlo con el metodo Create,
    //y no como la creación de objeto. Además, aqui se tiene que pasar una propiedad,
    // la URL de DB. 
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        mongooseConnection: mongoose.connection
    })
}));


//passport middleware

app.use(passport.initialize());
app.use(passport.session());

//flash

app.use(flash());

//Las siguientes lineas son Middleware que sirven para analizar
//los cuerpos JSON que se envian. Otra opción es usar Body-Parser, de la misma forma.
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cors());
connectDB();

//Para almacenar en una variable si el user inició sesión (con passport) o no
// Arreglar para uso de ingreso con local en MONGDB
app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});





const port = process.env.port || 3000;

app.use(errorHandler);
app.use("/", require("./routes/index"));
app.use("/", require('./routes//path.js'));
app.use("/auth", require('./routes/auth.js'));



app.listen(port);
console.log("Web server is listening at port ", port);
