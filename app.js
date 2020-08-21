//importando os modulos para o projeto
    const express = require('express')
    const app = express()

    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')

    const path = require('path')
    //importando o arquivo de rotas
    const admin = require('./routes/admin')
    //importando o modulo do mongoose que trabalha com o banco de dados mongoDB
    const mongoose = require('mongoose')

    //importando os modulos de sessoes 
    const session = require('express-session')
    const flash = require('connect-flash')

    //importando o modulo de postagens
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')

    //importando o modulo de categorias
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')

    //importando o modulo de usuarios
    const usuarios = require('./routes/usuario')

    //importando o modulo de autenticação
    const passport = require('passport')
    require('./config/auth')(passport)

    //public -> configurar os ficheiros estaticos como css e javascripts
    app.use(express.static(path.join(__dirname, "public")))
  
    
//configurações
    //sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //middleware
        app.use((req, res, next) => {
            //declarando variaveis globais
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null;
            next()
        })
    //body-parser 
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())
    //handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //mongoose
    mongoose.connect("mongodb://localhost/blogapp", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("O banco de dados esta funcionando corretamente")
    }).catch((err) => {
        console.log('Erro: ' + err)
    })
//rotas
    app.get('/', (req, res) => {
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then( (postagens) => {
            res.render("index", {postagens: postagens})
        }).catch( (err) => {
            req.flash("error_msg", "Não foi possivel mostras as Postagens")
            res.redirect('/404')
        })
        
    })

    app.get("/postagem/:slug", (req, res) => {
        Postagem.findOne( {slug: req.params.slug}).lean().then( (postagem) => {
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            }else{
                req.flash("error_msg", "Esta postagem nao existe")
                res.redirect("/")
            }
        }).catch( (err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect('/')
        })
    })  

    app.get('/categorias', (req, res) => {
        Categoria.find().lean().then( (categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch( (err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect('/')
        })
    })

    app.get("/categorias/:slug", (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then( (categoria) => {
            if(categoria) {
                Postagem.find({categoria: categoria._id}).lean().then( (postagens) => {
                    res.render('categorias/postagens', {postagens: postagens, categoria:categoria})
                }).catch( (err) => {
                    req.flash("error_msg", "Houve um erro ao listar os posts")
                    res.redirect('/')
                })
            }else{
                req.flash("error_msg", "Esta categoria nao existe")
                res.redirect('/')
            }
        }).catch ( (err) => {
            req.flash("error_msg", "Houve um erro ao carregar a pagina")
            res.redirect('/')
    })
    })

    app.get("/404", (req, res) => {
        res.send('Erro 404!')
    })
    app.use('/admin', admin)
    app.use('/usuarios', usuarios)
//outros
    const PORT = process.env.PORT || 8081
    app.listen(PORT, () => {
        console.log("O Servidor está a funcionar!!!")
    })