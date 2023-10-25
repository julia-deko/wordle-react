import { useState } from "react";


const useWordle = (solution) => {

  const [ turn, setTurn ] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([...Array(6)]); // each guess is an array
  const [history, setHistory] = useState([]); // each guess is a string
  const [isCorrect, setIsCorrect] = useState(false);
  const [ usedKeys, setUsedKeys ] = useState({});

  //format a guess into array of letter objects
  const formatGuess = () => {
    let solutionArray = [...solution];
    let formattedGuess = [...currentGuess].map((letter) => {
      return { key: letter, color: 'grey'  }
    });

    //find any green letters
    formattedGuess.forEach((l,i) => {
      if(solutionArray[i] === l.key) {
        formattedGuess[i].color = 'green';
        solutionArray[i] = null;
      }
    });

    //find any yellow letters
    formattedGuess.forEach((l,i) => {
      if(solutionArray.includes(l.key) && l.color !== 'green') {
        formattedGuess[i].color = 'yellow';
        solutionArray[solutionArray.indexOf(l.key)] = null;
      }
    });

    return formattedGuess;
  };

  const addNewGuess = (formattedGuess) => {
    if(currentGuess === solution) {
      setIsCorrect(true);
    }
    setGuesses((prev) => {
      let newGuesses = [ ...prev];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });
    setHistory((prev) => {
      return [...prev, currentGuess];
    });
    setTurn((prev) => {
      return prev + 1;
    });
    setUsedKeys(prevUsedKeys => {
      formattedGuess.forEach(l => {
        const currentColor = prevUsedKeys[l.key]

        if (l.color === 'green') {
          prevUsedKeys[l.key] = 'green'
          return
        }
        if (l.color === 'yellow' && currentColor !== 'green') {
          prevUsedKeys[l.key] = 'yellow'
          return
        }
        if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
          prevUsedKeys[l.key] = 'grey'
          return
        }
      })
      return prevUsedKeys
    })
    setCurrentGuess('');
  };
  
  const handleKeyUp = ({ key }) => {

    if(key === 'Enter') {
      //only add guess if turn is less than 5
      if(turn > 5) {
        console.log('you used all guesses');
        return;
      }

      //do not allow to dublicate words
      if(history.includes(currentGuess)) {
        console.log('you already tried that word');
        return;
      }

      //check word is 5 chars long
      if(currentGuess.length !== 5) {
        console.log('word must be 5 chars long');
        return;
      }
      const formatted = formatGuess();
      addNewGuess(formatted);
    }

    if(key === 'Backspace') {
      setCurrentGuess((prev) => {
        return prev.slice(0, -1);
      });
      return;
    }
    
    if(/^[A-Za-z]$/.test(key)) {
      if(currentGuess.length < 5) {
        setCurrentGuess((prev) => {
          return prev + key;
        });
      }
    }
  };

  return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyUp };
};

export default useWordle;