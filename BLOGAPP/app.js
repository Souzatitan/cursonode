const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require("body-parser")
const path = require('path');
const app = express();
const admin = require('./routes/admin');
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")

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
        Postagem.find().lean().populate("categoria").sort({data: 'desc'}).then((postagens) => {
            res.render("index", {postagens: postagens})
        }).catch((erro)=> {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })    

    app.get("/postagem/:slug", (req, res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=> {
            if(postagem) {
                res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")
            }
        }).catch((error)=> {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias", (req, res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render("categorias/index", {categorias: categorias})
        }).catch((error)=> {
            req.flash("error_msg", "Houve um erro interno ao listar")
            res.redirect("/")
        })    
    })

    app.get("/categorias/:slug", (req, res)=>{
        Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
            if(categoria){
                 
                Postagem.find({categoria: categoria._id}).lean().then((postagens)=>{

                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})


                }).catch((error)=>{
                    req.flash("erro_msg", "Houve um erro interno categorias")
                    res.redirect("/")
                })

            }else{
                req.flash("error_msg", "Essa categoria não exite ")
                res.redirect("/")
            }
        }).catch((error)=> {
            req.flash("error_msg", "Houve um erro interno categorias")
            res.redirect("/")
        })    
    })

    app.get("/404", (req, res)=> {
        res.send('Erro 404!')
    })

    app.get('/posts', (req, res) => {
        res.send('Lista de Posts');
});

    app.use('/admin', admin);

    app.get('/test-bootstrap', (req, res) => {
        res.render('test-bootstrap');
});
    app.use('/admin', admin)
    app.use("/usuarios", usuarios)

//Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Servidor Rodando na porta ${PORT}`);
});
