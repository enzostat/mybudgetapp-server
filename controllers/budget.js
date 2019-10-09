let router = require('express').Router()
let db = require('../models')
require('dotenv').config()
let jwt = require('jsonwebtoken')
let expressJWT = require('express-jwt')



router.get('/:id', (req,res) => {
    db.Finance.findOne({userId: req.params.id})
    .then(finance => {
        if (!finance) {
            return res.send('We were unable to find your budget. Are you sure you started one?')
        }
        res.send({finance})
    })
    .catch(err => {
        console.log(err)
        res.status(409).send({message: 'Bro, something fucked up. Bro I swear to god, it is not my fault'})
    })
})

router.post('/:id', (req,res) => {
    db.Finance.findOne({userId: req.params.id})
    .then(finance => {
        if(finance) {
            return res.status(409).send({message: 'You have already created a budget'})
        }
        db.Finance.create({
            salary: req.body.salary,
            rent: req.body.rent || req.body.mortgage,
            savings: req.body.savings,
            monthlies: req.body.monthlies,
            userId: req.params.id
        })
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

router.put('/:id', (req,res) => {
    db.Finance.findOneAndUpdate({userId: req.params.id})
    .then(finance => {
        res.send({finance})
    })
})





module.exports = router;