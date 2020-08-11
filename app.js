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
    //public -> configurar os ficheiros estaticos como css e javascripts
    app.use(express.static(path.join(__dirname, "public")))
  
//configurações
    //sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //middleware
        app.use((req, res, next) => {
            //declarando variaveis globais
            res.locals.success_msg = req.flash('Success_msg')
            res.locals.error_msg = req.flash('error_msg')
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
    app.use('/admin', admin)
//outros
    const PORT = 8081
    app.listen(8081, () => {
        console.log("O Servidor está a funcionar!!!")
    })