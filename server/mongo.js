const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://david35008:${password}@cluster0.dokgy.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    person.save().then(result => {
        console.log(`added ${person.name} ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}else {
    console.log("name should be in quotes if has more than one letter")
    mongoose.connection.close()
}