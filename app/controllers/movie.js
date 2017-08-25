let Movie = require('../models/movie')
let Category = require('../models/category')
let Comment = require('../models/comment')
let fs = require('fs')
let path = require('path')
let _ = require('underscore')

// detail page 详细信息页
exports.detail = (req, res) => {
    let id = req.params.id
    
    Movie.update({_id: id}, {$inc: {pv: 1}}, (err) => {
        if (err) console.log(err)
    })
    Movie.findById(id, (err, movie) => {
        Comment.find({movie: id}).populate('from', 'name').populate('reply.from reply.to', 'name')
        .exec((err, comments) => {
            res.render('detail', {
                title: ' 详情页',
                movie: movie,
                comments: comments
            })
        })
    })
}

// 海报上传
exports.savePoster = (req, res, next) => {
    req.poster = req.file.filename
    next()
}

// 表单提交
exports.save = (req, res) => {
    let id = req.body.movie._id
    let movieObj = req.body.movie
    let _movie

    if(req.poster) {
        movieObj.poster = req.poster
    }

    if (id) {
        Movie.findById(id, (err, movie) => {
            if (err) console.log(err)
            
            // 复制所有属性到movie对象上，并返回movie
            _movie =  _.extend(movie, movieObj)
            _movie.save((err, movie) => {
                if (err) console.log(err)
                
                res.redirect('/movie/' + movie._id)    
            })   
        })
    } else {
        _movie = new Movie(movieObj)
        let categoryId = movieObj.category
        let categoryName = movieObj.categoryName

        _movie.save((err, movie) => {
            if (err) console.log(err)
            
            if (categoryId) {
                Category.findById(categoryId, (err, category) => {
                    category.movies.push(movie._id)
                    category.save((err, category) => {
                        res.redirect('/movie/' + movie._id)
                    })
                })
            } else if (categoryName) {
                    Category.findByName(categoryName, (err, category) => {
                        if (!category) {
                            let category = new Category({
                                name: categoryName,
                                movies: [movie._id]
                            })
        
                            category.save((err, category) => {
                                movie.category = category._id
                                movie.save((err, movie) => {
                                    res.redirect('/movie/' + movie._id)
                                })
                            })
                        } else {
                            category.movies.push(movie._id)
                            category.save((err,category) => {
                                res.redirect('/movie/' + movie._id)
                            })
                        }
                    })
            } 
        })
    }
}

// admin update movie
exports.update = (req, res) => {
    let id = req.params.id

    if (id) {
        Movie.findById(id, (err, movie) => {
            Category.find({}, (err, categories) => {
             
                res.render('admin', {
                    title: 'movie 后台更新页',
                    movie: movie,
                    categories: categories
                })  
            })
        }) 
    }
}

// admin page 后台管理界面
exports.new = (req, res) => {
    Category.find({}, (err, categories) => {
        res.render('admin', {
            title: 'movie 后台录入页',
            categories: categories,
            movie: {}
        })
    })
}

// delete 
exports.del = (req, res) => {
    let id = req.query.id
    if(id) {
        Movie.remove({_id: id}, (err, movie) => {
            if (err) console.log(err)
            res.json({ success:1 })    
        })
    }
}

// list page 列表页
exports.list =  (req, res) => {
    Movie.fetch((err, movies) => {
        if (err) console.log(err)
            
        res.render('list', {
            title: 'movie 列表页',
            movies: movies
        })
    })
}
