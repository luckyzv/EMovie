const express = require('express')
const path = require('path')
const logger = require('morgan')

const bodyParser = require('body-parser')
const session = require('express-session')

const mongoose = require('mongoose')
const mongoStore = require('connect-mongo')(session)

const port = process.env.PORT || 3000
const dbUrl = 'mongodb://localhost/imooc'
mongoose.Promise = global.Promise
mongoose.connect(dbUrl, {useMongoClient: true})

const app = express()

app.set('views', path.join(__dirname,'app/views/pages'))
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }))

let db = mongoose.connection
db.on('error', function () {
    console.log("error")
})
db.once('open', function () {
    console.log('connect success')
})

// let models_path = __dirname + '/app/models'
// let walk = function(path) {
//     fs.readdirSync(path)
//     .forEach(function(file) {
//         let newPath = path + '/' + file
//         let stat = fs.statSync(newPath)
//         if (stat.isFile()) {
//             if(/(.*)\.(js|coffee)/.test(file)) {
//                 require(newPath)
//             }
//         } else if (stat.isDirectory()) {
//             walk(newPath)
//         }
//     })
// }
// walk(models_path)

// app.use(cookieParser())
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}))
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')
app.listen(port)

app.use(logger('dev'))
// let env = process.env.NODE_ENV || 'development'
// if ('development' === env) {
//     app.set('showStackError', true)
//     app.use(logger(':method :url :status'))
//     app.locals.pretty = true
//     // mongoose.set('debug', true)
// }

console.log(`listening on ${port}`)

require('./router/route')(app)
