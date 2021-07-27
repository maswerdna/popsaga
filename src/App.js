import React, {useState, useEffect} from 'react';
import './App.css';
function Seed(props) {
  return <div className={"seed" + (props.used)} onClick={props.onClick}>{props.name}</div>
}
function App() {
  let seeds = [];
  do {
    seeds.push(Math.floor(Math.random() * 50) + 1);
  } while (seeds.length < 20);
  seeds = [...new Set(seeds)];
  const [target] = useState(seeds.filter(even => even % 2 === 0).length);
  const [boxes, setBoxes] = useState({active: seeds, popped: []});
  const [duration, setDuration] = useState(Math.ceil(target * 0.85));
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [start, setStart] = useState(false);
  const buttonClick = i => {
    if (!start || won || lost || duration === 0) return;
    if (i % 2 === 0) {
      setBoxes({...boxes, popped: [...boxes.popped, i]});
    }
  }
  useEffect(() => {
      setWon(target === boxes.popped.length);
  }, [target, boxes]);
  useEffect(() => {
    if(start) {
      const timer = setInterval(() => {
        if (won) clearInterval(timer);
        else if (duration === 0) {setLost(true); clearInterval(timer)}
        else setDuration(duration => duration - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [won, duration, start]);
  return (
    <div className="game-board">
      <div className="timer">{duration}{!start && <div className="start" onClick={() => setStart(true)}>START</div>}</div>
      <div className="info-box">
        {
          won ? <><p>Game Over</p><div className="state green">You Won</div></> :
          lost ? <><p>Game Over</p><div className="state red">You lost</div></> :
          target - boxes.popped.length > 0 ?
            <><p>Remove all even numbers</p><div className="state blue">{target - boxes.popped.length} More</div></> : ""
        }
      </div>
      <div className={"seeds-box"+ (!start ? ' ready' : '')}>{
        boxes.active.map(box => <Seed
          key={box} 
          used={(boxes.popped.find(i => i === box)) ? " used" : ""} 
          name={box} 
          onClick={() => buttonClick(box)} />
        )
      }</div>
    </div>
  )
}
export default App;