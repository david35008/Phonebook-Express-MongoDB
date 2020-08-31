import React from 'react'

const Person = ({ person, handleClick }) => {
// debugger
  return (
    <li className='person' id={person.id}>
     Name: {person.name} <br/>
     Phone number: {person.number}
     <button onClick={(e) => handleClick(e.target.parentNode.id)} >delete</button>
    </li>
  )
}

export default Person