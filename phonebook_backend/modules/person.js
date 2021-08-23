const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const uri = process.env.MONGODB_URI

console.log("Connecting to", uri)

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true})
    .then(result => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.log("Could not connect to MongoDB:", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true
    },
    number: {
        type: String,
        validate: {
            validator: value => /(\D*\d){8}/.test(value),
            message: props => `Number must contain at least 8 digits!`
        }

    }
})

personSchema.set('toJSON', {
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)


