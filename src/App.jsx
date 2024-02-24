import { useEffect, useState } from 'react';
import './App.css'
import Die from './components/Die'
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti'

function App() {
	const [dice, setDice] = useState(allNewDice())
	const [tenzies, setTenzies] = useState(false)
	const [readyToStart, setReadyToStart] = useState(true)
	const [score, setScore] = useState({
		startTime: 0,
	})
	const [bestScore, setBestScore] = useState(getBestScore())
	const [currentScore, setCurrentScore] = useState(0)

	useEffect(() => {
		const allHeld = dice.every(die => die.isHeld)
		const firstValue = dice[0].value
		const allSameValue = dice.every(die => die.value === firstValue)
		if (allHeld && allSameValue) {
			setTenzies(true)
		}
	}, [dice])

	useEffect(() => {
		if (tenzies) {
			setReadyToStart(true)
			const newScore = (new Date().getTime() - score.startTime) / 1000
			setCurrentScore(newScore);
			const scores = JSON.parse(localStorage.getItem("scores")) || []
			scores.push(newScore)
			localStorage.setItem("scores", JSON.stringify(scores))
			setBestScore(getBestScore())
		}
	}, [tenzies])

	function getBestScore() {
		const scores = JSON.parse(localStorage.getItem("scores")) || []
		return scores.length > 0 ? Math.min(...scores) : 0
	}

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
		if (!readyToStart) {
			setDice(oldDice => oldDice.map(die => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die
			})
			)
		}
	}

	function startGame() {
		setReadyToStart(false);
		setTenzies(false);
		setDice(allNewDice())
		setScore(prevScore => ({
			...prevScore,
			startTime: new Date().getTime()
		}))
	}

	function handleResetClick() {
		localStorage.setItem("scores", JSON.stringify([]));
		setBestScore(getBestScore())
	}

	const diceElements = dice.map(die => <Die key={die.id} id={die.id} toggleHold={() => toggleHold(die.id)} isHeld={die.isHeld} value={die.value} />)

	return (
		<main className="tenzie-board">
			{tenzies && <Confetti />}
			{bestScore !== 0 && <h2 className="best-score">Best Score : {bestScore} </h2>}
			{tenzies && <h2 className="current-score">New Score : {currentScore} </h2>}
			{ bestScore !== 0 && <button onClick={handleResetClick} className="reset-btn">Reset Scores</button>}
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
			</p>
			<div className="dice-container">
				{diceElements}
			</div>
			{!readyToStart && <button className="roll-btn" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>}
			{readyToStart && <button className="roll-btn" onClick={startGame}>Start Game</button>}
		</main>
	)
}

export default App
