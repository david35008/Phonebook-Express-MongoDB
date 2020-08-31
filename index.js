require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

// morgan.token('body', function (req, res) {  if(req.method==='POST'){return JSON.stringify(req.body)}})
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(morgan(function (tokens, req, res) {
  if (req.method === 'POST') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }
}))

app.use(express.json())

app.use(express.static('build'))

let presons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 4
  }, {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  }, {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/info', (req, res) => {
  const response = `<p>Phonebook has info for ${presons.length} people</p><p>${new Date()}</p>`
  res.send(response)
})

app.get('/api/persons', (req, res) => {
  console.log('finding all persons');
  Person.find({}).then(person => {
    res.json(person)
  })
})

app.get('/api/persons/:id', (request, response) => {
  console.log('finding by id');
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      console.log("not Founded");
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.deleteOne({ "_id": request.params.id }).then(person => {
    if(person.deletedCount > 0){
      console.log('delete by id');
    } else {
      console.log('person not found');
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})

const rendomId = () => {
  const renId = (Math.random() * 1000000000000).toFixed();
  return renId;
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: rendomId(),
  })

  person.save().then(savedNote => {
    response.json(savedNote)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
