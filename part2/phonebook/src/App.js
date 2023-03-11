import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Filter = (props) => {
  return (
    <div>
        filter shown with <input
          value={props.input}
          onChange={props.handleInputChange}
        />
      </div>
  )
}

const Notification = ({ message, notifType }) => {
  if (message === null) {
    return null
  }

  else if (notifType === 'success')
  return (
    <div className='success'>
      {message}
    </div>
  )
  else
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Persons = ({personsToShow, deletePerson}) => {

  return (
    personsToShow.map(personToShow => 
    <p key = {personToShow.id}>{personToShow.name} {personToShow.number}
    <button onClick={() => deletePerson(personToShow.id)}>delete</button>
    </p>)
  )
}

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input
          value={newName}
          onChange={handleNameChange}
        />
        </div>
        <div>number: <input
          value={newNumber}
          onChange={handleNumberChange}
        /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [input, setInput] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons)
  const [notifMessage, setNotifMessage] = useState(null)
  const [notifType, setNotifType] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setPersonsToShow(initialPersons)
      })
  }, [])
  
  const deletePerson = (id) => {
    if (window.confirm(`Do you really want to delete user with id ${id}`)) {
      personService
      .deletePerson(id)
      .then(response => {
        setPersons(persons.filter(person => person.id != id))
        setPersonsToShow(persons.filter(person => person.id !== id))})
      .catch(error => {
        setNotifType('error')
        setNotifMessage(`Information of ${persons.find(person => person.id === id).name} has already been removed from server`)
        setTimeout(() => {
          setNotifMessage(null)
          setNotifType('')
        }, 3000)
      })

    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleInputChange = (event) => {
    console.log(event.target.value)
    setInput(event.target.value)
    setPersonsToShow(persons.filter(person => person.name.toLowerCase().includes((event.target.value).toLowerCase())))
  }

  const addPerson = (event) => {
    event.preventDefault()

    const person = persons.find(element => element.name === newName)
    const changedPerson = {...person, number: newNumber}

    if(person != undefined)
    {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) 
      {
        personService
        .update(person.id, changedPerson)
        .then(returnedPerson => 
        {setPersons(persons.map(p => p.id !== person.id? p : returnedPerson))
        setPersonsToShow(persons.map(p => p.id !== person.id? p : returnedPerson))
        setNotifMessage(`${newName} number is updated => ${newNumber}`)
        setNotifType('success')
        setTimeout(() => {
          setNotifMessage(null)
          setNotifType('')
        }, 3000)
      }
        )}

    }
    else {
      const nameObject = {
        name: newName,
        number: newNumber
      }
      personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setPersonsToShow(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotifMessage(`Added ${newName}`)
        setNotifType('success')
        setTimeout(() => {
          setNotifMessage(null)
          setNotifType('')
        }, 3000)
      })

    }
    
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} notifType = {notifType} />
      <Filter input = {input} handleInputChange={handleInputChange} />
      <h3>add a new</h3>
      <PersonForm newName = {newName} handleNameChange={handleNameChange} newNumber = {newNumber} handleNumberChange = {handleNumberChange} addPerson = {addPerson} />
      <h3>Numbers</h3>
      <Persons personsToShow = {personsToShow} deletePerson = {deletePerson}/>
    </div>
  )
}

export default App