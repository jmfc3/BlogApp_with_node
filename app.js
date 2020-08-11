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

    //public -> configurar os ficheiros estaticos como css e javascripts
    app.use(express.static(path.join(__dirname, "public")))
    //declaração um middleare
    app.use((req, res, next) => {
        console.log('Eu sou um middleare')
        next()
    })
//configurações
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