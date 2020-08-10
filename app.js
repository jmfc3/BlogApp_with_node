//importando os modulos para o projeto
    const express = require('express')
    const app = express()

    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')

    //importando o arquivo de rotas
    const admin = require('./routes/admin')
    //const mongoose = require('mongoose')


//configurações
    //body-parser 
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())
    //handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //mongoose
//rotas
    app.use('/admin', admin)
//outros
    const PORT = 8081
    app.listen(8081, () => {
        console.log("O Servidor está a funcionar!!!")
    })