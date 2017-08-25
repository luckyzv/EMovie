let mongoose = require('mongoose')
let bcryptjs = require('bcryptjs')
let SALT_WORK_FACTOR = 10

let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    password: String,
    // 0普通用户
    // 1认证用户
    // >10 管理员
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

UserSchema.pre('save', function (next) {
    let user = this
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    bcryptjs.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if(err) return next(err)
        bcryptjs.hash(user.password, salt, (err, hash) => {
            if (err) return next(err)
            user.password = hash
            next()    
        })
    })
})

// 实例方法
UserSchema.methods = {
    comparePassword: function (_password,cb) {
        bcryptjs.compare(_password, this.password, (err, isMatch) => {
            if (err) console.log(err)
            cb(null, isMatch)    
        })
    }
}


// 静态方法可直接调用
UserSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort('meta.updateAt').exec(cb)
    },
    findById: function (id, cb) {
        return this.findOne({_id: id}).exec(cb)
    }
}

module.exports = UserSchema