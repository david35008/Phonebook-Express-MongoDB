import React, { useState, useEffect } from 'react';
import Person from './components/Person';
import Notification from './components/Notification';
import phonebookService from './services/personsAjax';

const App = () => {
  const [phonebook, setPhonebook] = useState([]);
  const [newPerson, setNewPerson] = useState('');
  const [newPhoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchData = () => {
    phonebookService
      .getAll()
      .then(res => {
        setPhonebook(res);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const addPerson = (event) => {
    event.preventDefault()

    const noteObject = {
      name: newPerson,
      number: newPhoneNumber
    };
    let method = false;
    let id
    phonebook.forEach(person => {
      if (person.name === newPerson) {
        method = true
        id = person.id
      }
    })
    if (!method) {
      phonebookService.create(noteObject)
    } else {
      phonebookService.update(id, noteObject)
    }
    fetchData();
    setNewPerson('');
    setPhoneNumber('');
  }

  const handlePersonChange = (event) => {
    setNewPerson(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const deleteContact = (event) => {
    phonebookService.remove(event)
      .then(() => {
        fetchData();
      }
      ).catch(error =>
        setErrorMessage(error.message)
      )

  }

  return (
    <div>
      <h1>Phone Book</h1>
      <Notification message={errorMessage} />
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
      </form >
      <div className='phonebookList'>
        <ul className='panel'>
          {phonebook.map((person, i) =>
            <Person
              key={i}
              person={person}
              deleteContact={deleteContact}
            />
          )}
        </ul>
      </div>
    </div>
  )
}

export default App 