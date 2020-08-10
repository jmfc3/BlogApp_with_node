const express = require('express')
const router  = express.Router()

router.get('/', (req, res) => {
    res.send('rota principal da aplicação')
})

router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})

router.get('/categorias', (req, res) => {
    res.send('Pagina de categorias!')
})



module.exports = router