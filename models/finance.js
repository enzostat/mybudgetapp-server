let mongoose = require('mongoose')

let financeSchema = new mongoose.Schema({
    salary: {
        type: Number,
        required: true
    },
    monthlies: [{
        name: String,
        amount: Number,
        category: String
    }],
    rent: {
        type: Number,
        default: 0
    },
    savings: {
        type: Number,
        default: 0
    },
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