import { useEffect, useState } from 'react';
import './App.css'
import Die from './components/Die'
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti'

function App() {
	const [dice, setDice] = useState(allNewDice())
	const [tenzies, setTenzies] = useState(false)

	useEffect(() => {
		const allHeld = dice.every(die => die.isHeld)
		const firstValue = dice[0].value
		const allSameValue = dice.every(die => die.value === firstValue)
		if (allHeld && allSameValue) {
			setTenzies(true)
		}
	}, [dice])

	function generateNewDie() {
		return {
			id: nanoid(),
			value: Math.ceil(Math.random() * 6),
			isHeld: false
		}
	}

	function allNewDice() {
		const newDice = []
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie())
		}
		return newDice
	}

	function rollDice() {
		if (tenzies) {
			setDice(allNewDice())
			setTenzies(false)
		} else {
			setDice(oldDice => oldDice.map(die => {
				return die.isHeld ? die : generateNewDie()
			}))
		}
	}

	function toggleHold(id) {
		setDice(oldDice => oldDice.map(die => {
			return die.id === id ? { ...die, isHeld: !die.isHeld } : die
		})
		)
	}

	const diceElements = dice.map(die => <Die key={die.id} id={die.id} toggleHold={() => toggleHold(die.id)} isHeld={die.isHeld} value={die.value} />)

	return (
		<main className="tenzie-board">
			{ tenzies && <Confetti /> }
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
			</p>
			<div className="dice-container">
				{diceElements}
			</div>
			<button className="roll-btn" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
		</main>
	)
}

export default App
