import React from 'react'

const Person = ({ person }) => {


  return (
    <li className='person'>
     Name: {person.name} <br/>
     Phone number: {person.number}
    </li>
  )
}

export default Person