let express = require('express');
let app = express();
let mongoose = require('mongoose');
let restRouter = require('./routes/rest');
let indexRouter = require('./routes/index');
let path = require('path');

mongoose.connect("mongodb://user:user@ds161028.mlab.com:61028/coj");

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/api/v1', restRouter);

app.use(function(req, res) {
    res.sendFile("index.html", {root: path.join(__dirname, '../public/')});
})

app.listen(3000, function(){
    console.log("App is listening port 3000...");
})