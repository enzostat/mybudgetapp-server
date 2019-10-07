let router = require('express').Router()
let db = require('../models')
require('dotenv').config()
let jwt = require('jsonwebtoken')
let expressJWT = require('express-jwt')

//POST /auth/login (find and validate a user; send token)
router.post('/login', (req,res) => {
    //find user by email in the datbase
    db.User.findOne({ email: req.body.email})
    .then(user => {
        //make sure we have a user and that the user has a password
        if(!user || !user.password) {
            return res.status(404).send({message: 'User not found'})
        }

        //yay - we got a user. let's check their password.
        if (!user.isAuthenticated(req.body.password)) {
            //invalid credentials: wrong password
            return res.status(406).send({message: 'Unacceptable: Invalid Credentials'})
        }

        let token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: 60*60*24*7 //8 hours in seconds
        })

        res.send({token})
    })
    .catch(err => {
        //if something went wrong here, it's likely a db issue or a typo
        console.log(err)
        res.status(503).send({message: 'Something database related went wrong. Or a typo'})
    })
})

router.post('/signup', (req,res) => {
    db.User.findOne({ email: req.body.email})
    .then(user => {
        //if user exists do NOT let them create a duplicate account
        if(user) {
            return res.status(409).send({message: 'Email address in use'})
        }
    
        //Good-user doesn't exist
        db.User.create(req.body)
        .then(newUser => {
            //we have created a user, let's make them a shiny new token!
            let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
                expiresIn: 60*60*24 //in seconds
            })

            res.send({token})
        })
        .catch(err => {
            console.log('Error when creating new user', err)
            res.status(500).send({message: 'Error creating user'})
        })
    })
    .catch(err => {
        console.log("Error in POST /auth/signup",err)
        res.status(503).send({message: 'Something went wrong, probably database related. Or you made a type. One of those.'})
    })
})

router.get('/current/user', (req, res) => {
    console.log(req.user)
    //the user is logged in, so req.user should have data
    if(!req.user || !req.user._id) {
        res.status(401).send({message: 'Check configuration'})
    }
    //NOTE: this is the user data from the time the token was issued
    //WARNINGL if you update the user info, those changes will not be reflected here
    //To avoid this, reissue a token when you update user data
    res.send({user: req.user})
})

module.exports = router;