let User = require('../models/user')

// signup page
exports.signup = (req, res) => {
    let _user = req.body.user

    User.findOne({name: _user.name}, (err, user) => {
        if (err) console.log(err)
        // 用户名存在
        if (user) {
            return res.redirect('/signin')
        } else {
            // 新建一个用户数据
            let user = new User(_user)
    
            user.save((err, user) => {
                if(err) console.log(err)
                
                res.redirect('/')
            })
        }    
    })
}

// singin page
exports.signin = (req, res) => {
    let _user = req.body.user
    let name = _user.name
    let password = _user.password
    User.findOne({name: name}, (err, user) => {
        if (err) console.log(err)
        if (!user) {
            return res.redirect('/signup')
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) console.log(err)
            if (isMatch) {
                req.session.user = user
                return res.redirect('/')
            } else {
                return res.redirect('/signin')
                console.log('password wrong')
            }
        })
    })
}

// logout page
exports.logout =  (req, res) => {
    delete req.session.user
    // delete app.locals.user
    res.redirect('/')
}

// userlist page
exports.userlist = (req, res) => {

    User.fetch((err, users) => {
        if (err) console.log(err)
        res.render('userlist', {
            title: '用户列表页',
            users: users
        })    
    })
}

// 登录
exports.showSignin = (req, res) => {
    res.render('signin', {
        title: '登录',
    })
}

// 注册
exports.showSignup = (req, res) => {
    res.render('signup', {
        title: '注册'
    })
}

exports.signinRequired = (req, res, next) => {
    let user = req.session.user
    if (!user) {
        return res.redirect('/signin')
    }
    next()
}

exports.adminRequired = (req, res, next) => {
    let role = req.session.user.role
    if (role <= 10) {
        return res.redirect('/signin')
    } 
    next()
}