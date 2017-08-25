let Category = require('../models/category')

exports.new = (req, res) => {
    res.render('admin_category', {
        title: 'movie 后台录入页',
        category: {}
    })
}

exports.save = (req, res) => {
    let _category = req.body.category
    let category = new Category(_category)

    category.save((err, category) => {
        if (err) console.log(err)
        res.redirect('/admin/category/list')
    })
}

exports.list = (req, res) => {
    Category.fetch((err, categories) => {
        if (err) console.log(err)
        res.render('categorylist', {
            title: 'movie 分类列表',
            categories: categories
        })   
    })
}