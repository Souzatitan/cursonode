const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require("body-parser")
const path = require('path');
const app = express();
const admin = require('./routes/admin');
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")

// Configurações
//sessão
    app.use((session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    })))
    app.use(flash())
//Middleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })    

//body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(express.static(path.join(__dirname, 'public')));


    app.engine('handlebars', engine({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');

//Mongoose
    
    mongoose.connect("mongodb://localhost/blogapp").then(() =>{
        console.log("Conectado ao mongo")
    }).catch((erro) => {
        console.log("Erro ao se conectar" + erro)
    })

// Rotas
    app.get('/', (req, res) => {
        res.send('Rota principal');
});

    app.get('/posts', (req, res) => {
        res.send('Lista de Posts');
});

    app.use('/admin', admin);

    app.get('/test-bootstrap', (req, res) => {
        res.render('test-bootstrap');
});

    const PORT = 8081;
    app.listen(PORT, () => {
        console.log(`Servidor Rodando na porta ${PORT}`);
});
