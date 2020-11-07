import React from 'react'

const Person = ({ person, deleteContact }) => {
  return (
    <li className='person' id={person.id}>
        <div>
          {person.name}
        </div>
        <div>
          {person.number}
        </div>
        <button onClick={(e) => deleteContact(e.target.parentNode.id)} >Delete</button>
    </li>
  )
}

export default Person