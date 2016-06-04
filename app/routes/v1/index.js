var app = module.exports = require('express')();
var view = appRequire('view').root(__dirname+'/views');

app.use(function (req, res, next) {
    res.view = function (args) {
        args = Array.prototype.slice.call(arguments, 0);
        res.send(res.serialize.apply(res, args));
    };

    res.serialize = function (args) {
        args = Array.prototype.slice.call(arguments, 0);
        var name = args[0];
        args = args.slice(1);

        return view(name).apply({}, args);
    };

    next();
});

// set up app template handling
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

// load up the routes
app.use('/auth', require('./auth'));
app.use('/projects', require('./projects'));
app.use('/users', require('./users'));
