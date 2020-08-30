import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import Notification from './components/Notification'
import phonebookService from './services/persons'

const App = () => {
  const [phonebook, setPhonebook] = useState([]) 
  const [newPerson, setNewPerson] = useState('')
  const [newPhoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(res => {
        setPhonebook(res)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const noteObject = {
      name: newPerson,
      number: newPhoneNumber
    }
  
    phonebookService
      .create(noteObject)
      .then(returnedNote => {
        setPhonebook(phonebook.concat(returnedNote))
        setNewPerson('')
      })
  }

  const handlePersonChange = (event) => {
    setNewPerson(event.target.value)
  }

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value)
  }

  return (
    <div>
      <h1>Persons</h1>
      <Notification message={errorMessage} />
      <ul>
        {phonebook.map((person, i) => 
          <Person
            key={i}
            person={person} 
          />
        )}
      </ul>
      <form onSubmit={addPerson}>
        <input
          value={newPerson}
          placeholder={'Type new name...'}
          onChange={handlePersonChange}
          required
        />
         <input
          value={newPhoneNumber}
          placeholder={'Type new phoneNumber...'}
          onChange={handlePhoneNumberChange}
          required
        />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}

export default App 