let mongoose = require('mongoose')

let financeSchema = new mongoose.Schema({
    salary: Number,
    monthlies: [{
        name: String,
        amount: Number,
        category: String
    }],
    rent: Number,
    savings: Number,
    incidentals: [{
        name: String,
        amount: Number,
        category: String
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
})

module.exports = mongoose.model('finance', financeSchema)