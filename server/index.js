require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

// morgan.token('body', function (req, res) {  if(req.method==='POST'){return JSON.stringify(req.body)}})
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('../build'));
app.use(express.json());

app.use(morgan(function (tokens, req, res) {
  const myTiny =[tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms']
  if (req.method === 'POST') {
    return myTiny.concat([JSON.stringify(req.body)]).join(' ')
  } else {
    return myTiny.join(' ')
  }
}));

// app.use(logger);

app.get('/info', (req, res) => {
  const response = `<p>Phonebook has info for ${presons.length} people</p><p>${new Date()}</p>`;
  res.send(response);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    };
  })
  .catch(error => {
    next(error);
  });
});

const rendomId = () => {
  const renId = (Math.random() * 1000000000000).toFixed();
  return renId;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' });
  };

  const person = new Person({
    name: body.name,
    number: body.number,
    id: rendomId(),
  });
  person.save().then(savedNote => {
    response.json(savedNote);
  });
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end();
  })
  .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  };

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
