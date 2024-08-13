require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(express.json())

app.use(cors())

morgan.token('body', function(req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))

app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', async (request, response) => {
  const date = new Date()
  const numberPersons =  await Person.countDocuments({})
  let message = `<p>Phonebook has info for ${numberPersons} people</p><br><p>${date}</p>`
  response.send(message)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

const generateId = () => {
  let id
  do {
    id = Math.floor(Math.random() * 1000000)
  } while (persons.find(p => p.id === id))
  return id
}

app.put('/api/persons/:id', (request, response, next) => {
  const body= request.body
  const person={
    name: body.name.replace(/\b\w/g, l => l.toUpperCase()),
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))

})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body


  const personExists = await Person.find({ name: body.name })
  if(personExists.length===1){
    app.put(`/api/persons/${personExists[0]._id}`, request, response, next)
  }

  const person = new Person({
    name: body.name.replace(/\b\w/g, l => l.toUpperCase()),
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next ) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT =  process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
