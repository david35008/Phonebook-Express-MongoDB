const express = require('express')
const morgan = require('morgan')
const { static } = require('express')
const app = express()

app.use(morgan(function (tokens, req, res) {
  if(req.method==='POST'){
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

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

app.get('/info', (req, res) => {
  const response = `<p>Phonebook has info for ${presons.length} people</p><p>${new Date()}</p>`
  res.send(response)
})

app.get('/api/persons', (req, res) => {
  res.json(presons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = presons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  presons = presons.filter(person => person.id !== id)
  response.status(204).end()
})

// const generateId = () => {
//   const maxId = presons.length > 0
//     ? Math.max(...presons.map(n => n.id))
//     : 0
//   return maxId + 1
// }

const rendomId = () => {
const renId = (Math.random()*1000000000000).toFixed();
return renId;
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (presons.some(person=> person.name===body.name)) {
    return response.status(400).json({ 
      error: 'name already exist' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: rendomId(),
  }

  presons = presons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
