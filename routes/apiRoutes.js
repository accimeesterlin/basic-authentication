const express = require('express');
const log = console.log;
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const connection = require('../connection');


router.post('/login', (req, res) => {
    const email = req.body.email; // user input
    const password = req.body.password; // user input

    connection.query('SELECT * FROM users where email = ?', [email], function(err, data) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server error'
            });
        }

        // No User
        if (data.length === 0) {
            return res.status(402).json({
                message: 'No user found!!'
            });
        }

        // if user exist
        const hashPassword = data[0].password; // encrypted password 

        const isPasswordValid = bcrypt.compareSync(password, hashPassword); // compare passsword

        if (isPasswordValid) {
            // This is the right user
            const token = jwt.sign({
                id: data[0].id,
                email: email
            }, 'ilovemydog'); // generate a token

            return res.cookie('token', token).json({
                message: 'You are not logged in!!'
            });
        }

        // Wrong User
        return res.status(401).json({
            message: 'Not authorized!!!'
        });
    });
});

router.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    connection.query('SELECT * FROM users where email = ?', [email], function (err, data) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server error'
            });
        }
        // No user
        if (data.length === 0) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt); // encrypted password

            const user = {
                email,
                password: hash
            };
            // Saving User
            connection.query('INSERT INTO users SET ?', user, function (error, results) {
                if (error) {
                    return res.status(500).json({
                        message: 'Not able to create user'
                    })
                }

                // User created
                // This is the right user
                const token = jwt.sign({
                    id: data[0].id,
                    email: email
                }, 'ilovemydog')
                res.cookie('token', token).json({
                    message: 'User successfully created!!!'
                });
            });

        } else {
            res.status(403).json({
                message: 'User already exist!!'
            });;
        }
    });
});

router.get('/signout', (req, res) => {
    req.session.destroy(function (err) {
        // cannot access session here
        if (err) {
            res.redirect('/login');
        } else {
            res.redirect('/login');
        }
    });
});


module.exports = router;