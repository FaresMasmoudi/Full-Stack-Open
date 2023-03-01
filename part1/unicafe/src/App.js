import { useState } from 'react'

const Header = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.total===0)
  return (
    <p>no feedback given</p>
  )
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={props.statGood} />
        <StatisticLine text="neutral" value={props.statNeutral} />
        <StatisticLine text="bad" value={props.statBad} />
        <StatisticLine text="all" value={props.statGood + props.statNeutral + props.statBad} />
        <StatisticLine text="average" value={(props.statGood-props.statBad)/(props.statGood + props.statNeutral + props.statBad)} />
        <StatisticLine text="positive" value={props.statGood/(props.statGood + props.statNeutral + props.statBad)} />
      </tbody>
    </table>
  )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const handleGood = () => {
    console.log('Good clicked')
    const updatedGood = good + 1
    setGood(updatedGood)
    setTotal(updatedGood + neutral + bad)
  }

  const handleNeutral = () => {
    console.log('Neutral clicked')
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setTotal(good + updatedNeutral + bad)
  }

  const handleBad = () => {
    console.log('Bad clicked')
    const updatedBad = bad + 1
    setBad(updatedBad)
    setTotal(good + neutral + updatedBad)
  }

  return (
    <div>
      <Header text='give feedback' />
      <Button handleClick={handleGood} text='good' />
      <Button handleClick={handleNeutral} text='neutral' />
      <Button handleClick={handleBad} text='bad' />
      <Header text='statistics' />
      <Statistics statGood={good} statNeutral={neutral} statBad={bad} total={total} />
    </div>
  )
}

export default App