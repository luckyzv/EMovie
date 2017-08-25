let Movie = require('../models/movie')
let Category = require('../models/category')

// index page
exports.index = function (req, res) {
    Category.find({}).populate({path: 'movies', options: {limit: 5}})
    .exec((err, categories) => {
            if(err) console.log(err)
            res.render('index', {
                title: 'movie 首页',
                categories: categories
            })    
        })
}

exports.search = (req, res) => {
    let catId = req.query.cat
    let q = req.query.q
    let page = parseInt(req.query.p, 10) || 0
    let count = 2
    let index = page * count
    
    if (catId) {
        Category.find({_id: catId}).populate({
            path: 'movies',
            select: 'title poster',
        })
        .exec((err, categories) => {
            if (err) console.log(err)
    
            let category = categories[0] || {}
            let movies = category.movies || []
            let results = movies.slice(index, index + count)
    
            res.render('results', {
                title: 'movie 结果列表首页',
                keyword: category.name,
                currentPage: (page + 1),
                query: 'cat=' + catId,
                totalPage: Math.ceil(movies.length / count), 
                movies: results
            })    
        })
    } else {
        Movie.find({title: new RegExp(q + '.*', 'i')}).exec((err, movies) => {
            if (err) console.log(err)
            
            let results = movies.slice(index, index + count)
            res.render('results', {
                title: 'movie 搜索结果界面',
                keyword: q,
                currentPage: (page + 1),
                query: 'q=' + q,
                totalPage: Math.ceil(movies.length / count),
                movies: results
            })    
        })
    }
}