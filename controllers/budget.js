let router = require('express').Router()
let db = require('../models')
require('dotenv').config()
let jwt = require('jsonwebtoken')
let expressJWT = require('express-jwt')



router.get('/', (req,res) => {
    res.send('Nothing to see here')
})

router.get('/:id', (req,res) => {
    db.finance.findOne({userId: req.params.id})
    .then(finance => {
        if(finance) {
            return res.status(409).send({message: 'You have already created a budget'})
        }
        db.finance.create(req.body)
        .then(newBudget => {
            res.send({newBudget})
        })
        .catch(err => {
            console.log(err)
            res.send('there was an issue creating your budget')
        })
    })
    .catch(err => {
        console.log(err)
        res.send('there was an issue in accessing the database')
    })
})

router.put('/', (req,res) => {

})





module.exports = router;