var connectDB = function (mongoose) {
    
    mongoose.connect('mongodb://localhost/VFace')
    // 实例化连接对象
    const db = mongoose.connection
    db.on('error', console.error.bind(console, '连接错误：'))
    db.once('open', (callback) => {
        console.log('MongoDB连接成功！！')
        
    })
}

module.exports = connectDB
