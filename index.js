//require needed packages
let cors = require('cors')
let express = require('express');
let morgan = require('morgan')
let rowdyLogger = require('rowdy-logger')
require('dotenv').config()
let jwt = require('jsonwebtoken')
let expressJWT = require('express-jwt')

//initiate app
let app = express();
let rowdyResults = rowdyLogger.begin(app)

//middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: '10mb'}))


//controllers
app.use('/auth',expressJWT({
    secret: process.env.JWT_SECRET
}).unless({
    path: [
        {url: '/auth/login', methods: ['POST']},
        {url: '/auth/signup', methods: ['POST']}
    ]
}), require('./controllers/auth'))
// app.use('/budget', require('./controllers/budget'))

app.use('/budget',expressJWT({
    secret: process.env.JWT_SECRET
}), require('./controllers/budget'))

//Routes
app.get('*', (req,res) => {
    res.status(404).send({message: 'Not Found'})
})


//export
app.listen(process.env.PORT || 3001, () => {
    rowdyResults.print()
})