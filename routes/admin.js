const express = require('express')
const router  = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/', (req, res) => {
    res.render("admin/index");
})

router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})


router.get('/categorias', async (req, res, next) => {
    try {
      const categorias = await Categoria.find();
      return res.render("admin/categorias", {categorias: categorias.map(categorias => categorias.toJSON())})
    } catch (err) {
      req.flash("error_msg", "Houve um erro ao carregar as categorias")
      res.redirect('/')
    }
  })

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategoria')
})

router.post('/categorias/nova', (req, res) => {

    var erros = []
    //verificação dos campos do formulario
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.sug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Noma da categoria muito pequeno"})
    }

    if(erros.length > 0){
        res.render('admin/addcategoria', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria.")
            res.redirect('/admin')
        })
    }
} )


router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias', {categoria:categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria nao existe")
        res.redirect("/admin/categorias")
    })
    
})

router.post("/categorias/edit", (req, res) => {

    Categoria.findOne({_id: req.body.id}).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
    
        categoria.save().then( () => {
            req.flash("success_msg", "Categoria editada com sucesso")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a categoria")
            res.redirect('/admin/categorias')
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect('/admin/categorias')
    })

})


module.exports = router