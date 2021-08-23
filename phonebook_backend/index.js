require('dotenv').config()
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) =>
{
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/",(request,response) => {
    response.send('<h1>Hello</h1>')
})

app.get("/api/people",(request,response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get("/api/people/:id", (request,response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete("/api/people/:id", (request,response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result =>{
        response.status(204).end()
    })
        .catch(error => next(error))

    const id = Number(request.params.id)
    persons = persons.filter(t => t.id !== id)
    response.status(204).end()
})

app.post("/api/people", (request,response, next) => {
    const newPerson = request.body
    console.log(newPerson)

    if (newPerson.name === undefined) {
        return response.status(400).json({
            error: "The name is missing."
        })
    }

    if (newPerson.number === undefined) {
        return response.status(400).json({
            error: "The number is missing."
        })
    }
    Person.find({}).then(people =>
    {
        // if (people.map(t => t.name).includes(newPerson.name)){
        //     const IdWithSameName = people.filter(t => t.name === newPerson.name)[0]._id
        //     Person.findByIdAndUpdate(IdWithSameName, newPerson, {new: true})
        //         .then(changedPerson => {
        //             console.log(changedPerson)
        //             return response.json(changedPerson)
        //         })
        //         .catch(error => next(error))
        // }
        // else{
        const person = new Person({
            name: newPerson.name,
            number: newPerson.number
        })
        person
            .save()
            .then(savedPerson => {
                response.json(savedPerson.toJSON())
            })
            .catch(error => next(error))
        // }
    })



})

app.get("/info",(request,response) => {
    Person.find({}).then(people => {
        response.send(`<p>Phonebook has info for ${people.length} people</p><p>${new Date().toString()}</p>`)
    })
})

const unknownEndpoint = (request,response) => {
    response.status(404).send({error: "unknown endpoint"})
}
app.use(unknownEndpoint)

const errorHandler = (error,request,response,next) => {
    console.log(error)

    if (error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
    if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
