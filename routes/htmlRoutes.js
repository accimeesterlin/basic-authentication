const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');
const join = path.join;

// Express Middleware
function privateRoute(req, res, next) {

    let token;
    let decoded;

    if (req.cookies.token) {
        token = req.cookies.token;
        decoded = jwt.verify(token, 'ilovemydog');
    }

    if (decoded) {
        next(); // go and access data into my server
    } else {
        res.redirect('/login');
    }
}


router.get('/set/:id', (req, res) => {
    const id = req.params.id;

    // set a cookie
    res.cookie('id-' + id, id).json({
        message: 'Cookie Set!!'
    });
});


router.get('/', (req, res) => {
    console.log('Cookies: ', req.cookies);
    res.sendFile(join(__dirname, '..', 'views', 'index.html'));
});

router.get('/login', (req, res) => {
    console.log('Cookies: ', req.cookies);
    res.sendFile(join(__dirname, '..', 'views', 'login.html'));
});

router.get('/signup', (req, res) => {
    console.log('Cookies: ', req.cookies);
    res.sendFile(join(__dirname, '..', 'views', 'signup.html'));
});

router.get('/dashboard', privateRoute, (req, res) => {
    console.log('Cookies: ', req.cookies);
    res.sendFile(join(__dirname, '..', 'views', 'dashboard.html'));
});


module.exports = router;