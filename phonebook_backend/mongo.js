const mongoose = require('mongoose')

if (process.argv.length <3){
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://greczimarton:${password}@cluster0.sj93w.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true})

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', phonebookSchema)
//
// const note = new Note({
//     content: "Callback-functions suck",
//     date: new Date(),
//     important: true
// })
//
// note.save().then(result =>{
//     console.log("note saved")
//     mongoose.connection.close()
// })

const name = process.argv[3]
const number = process.argv[4]

if (typeof(name) != 'undefined' && typeof(number) != 'undefined'){
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(() => {
        console.log(`Added ${name}, number: ${number} to phonebook`)
        mongoose.connection.close()
    })
}
else{
    Person.find({}).then(result => {
        for (let person in result) {
            console.log(result[person])
        }
        mongoose.connection.close()
    })
}




