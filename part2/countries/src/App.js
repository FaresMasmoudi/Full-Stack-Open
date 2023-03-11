import { useState, useEffect } from 'react'
import axios from 'axios'

const Feedback = ({filteredCountries, toggleShow, country, weather}) => {

  if(filteredCountries.length > 10){
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }
  else if(filteredCountries.length <=  10 && filteredCountries.length >1){
    return (
        filteredCountries.map(filteredCountry => 
          <p key = {filteredCountry.name.common}>{filteredCountry.name.common} <button onClick={() => toggleShow(filteredCountry)}>show</button></p>
        )
    )
  }

  else if(filteredCountries.length===1 && weather !==null)
  {
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((value) => <li key = {value}>{value}</li>)}
        </ul>
        <img src={country.flags.png} alt="" />
        <p>temperature {(weather.main.temp -273.15).toFixed(2)} Celsius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
        <p>wind {weather.wind.speed} m/s</p>
      </div>
    )
  }

}

const Filter = ({input, handleInputChange}) => {
  return (
    <div>
        find countries <input
          value={input}
          onChange={handleInputChange}
        />
      </div>
  )
}

const App = () => {
  const [input, setInput] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const api_key = process.env.REACT_APP_API_KEY
  
  useEffect(() => {
  if (country) {
    const weather_link = `http://api.openweathermap.org/data/2.5/weather?q=${country.capital},${country.tld.cca2}&APPID=${api_key}`
    axios
      .get(weather_link)
      .then(response => {
        setWeather(response.data)
      })
  }
  }, [country])

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const toggleShow = (toggledCountry) => {
    setFilteredCountries([toggledCountry])
    setCountry(toggledCountry)
  }


  const handleInputChange = (event) => {
    setInput(event.target.value)
    setFilteredCountries(countries.filter(country => country.name.common.toLowerCase().includes((event.target.value).toLowerCase())))
    if(countries.filter(country => country.name.common.toLowerCase().includes((event.target.value).toLowerCase())).length === 1)
    setCountry(countries.filter(country => country.name.common.toLowerCase().includes((event.target.value).toLowerCase()))[0])
  }

  return (
    <div>
      <Filter input = {input} handleInputChange={handleInputChange} />
      <Feedback filteredCountries = {filteredCountries} country = {country} toggleShow = {toggleShow} weather = {weather} />
    </div>
  )
}
export default App