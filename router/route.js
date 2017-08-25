let Index = require('../app/controllers/index')
let Movie = require('../app/controllers/movie')
let User = require('../app/controllers/user')
let Comment = require('../app/controllers/comment')
let Category = require('../app/controllers/category')
let multer = require('multer')

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        let type = file.mimetype.split('/')[1]
        cb(null, Date.now() + '.' + type)
    }
})

let upload = multer({storage: storage})

module.exports = function (app) {

    // pre handle user
    app.use((req, res, next) => {
        let _user = req.session.user
        app.locals.user = _user
        next()
    })
    
    app.get('/', Index.index)

    // user相关
    app.post('/user/signup', User.signup)
    app.post('/user/signin', User.signin)
    app.get('/signin', User.showSignin)
    app.get('/signup', User.showSignup)
    app.get('/logout', User.logout)
    app.get('/admin/user/userlist', User.signinRequired, User.adminRequired, User.userlist)
    
    // movie相关
    app.get('/movie/:id', Movie.detail)
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
    app.post('/admin/movie', User.signinRequired, User.adminRequired, upload.single('uploadPoster'), Movie.savePoster, Movie.save)
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

    // comment相关
    app.post('/user/comment', User.signinRequired, Comment.save)

    // category相关
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
    app.post('/admin/category/', User.signinRequired, User.adminRequired, Category.save)
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

    // result 相关
    app.get('/results', Index.search)
}