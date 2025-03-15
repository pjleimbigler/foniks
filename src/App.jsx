import React, { useState, useEffect } from 'react';

// Animal emojis with difficulty levels
const ANIMAL_EMOJIS = {
  ant: { emoji: '🐜', difficulty: 'easy' },
  bear: { emoji: '🐻', difficulty: 'medium' },
  bee: { emoji: '🐝', difficulty: 'medium' },
  bird: { emoji: '🐦', difficulty: 'medium' },
  bug: { emoji: '🐛', difficulty: 'easy' },
  cat: { emoji: '🐱', difficulty: 'easy' },
  cow: { emoji: '🐄', difficulty: 'medium' },
  dog: { emoji: '🐶', difficulty: 'easy' },
  duck: { emoji: '🦆', difficulty: 'easy' },
  fish: { emoji: '🐟', difficulty: 'medium' },
  fox: { emoji: '🦊', difficulty: 'medium' },
  frog: { emoji: '🐸', difficulty: 'medium' },
  giraffe: { emoji: '🦒', difficulty: 'hard' },
  goat: { emoji: '🐐', difficulty: 'medium' },
  lion: { emoji: '🦁', difficulty: 'medium' },
  mouse: { emoji: '🐭', difficulty: 'hard' },
  owl: { emoji: '🦉', difficulty: 'medium' },
  pig: { emoji: '🐷', difficulty: 'easy' },
  rabbit: { emoji: '🐰', difficulty: 'medium' },
  tiger: { emoji: '🐯', difficulty: 'medium' },
  wolf: { emoji: '🐺', difficulty: 'medium' },
  yak: { emoji: '🦬', difficulty: 'easy' }
};

// People and body parts emojis with difficulty levels
const PEOPLE_AND_BODY_EMOJIS = {
  ear: { emoji: '👂', difficulty: 'medium' },
  eye: { emoji: '👁️', difficulty: 'hard' },
  foot: { emoji: '🦶', difficulty: 'medium' },
  hand: { emoji: '👋', difficulty: 'easy' },
  mouth: { emoji: '👄', difficulty: 'hard' },
  nose: { emoji: '👃', difficulty: 'medium' },
  tongue: { emoji: '👅', difficulty: 'hard' },
  tooth: { emoji: '🦷', difficulty: 'hard' }
};

// Transportation emojis with difficulty levels
const TRANSPORT_EMOJIS = {
  boat: { emoji: '⛵', difficulty: 'medium' },
  bus: { emoji: '🚌', difficulty: 'easy' },
  car: { emoji: '🚗', difficulty: 'easy' },
  ship: { emoji: '🚢', difficulty: 'medium' }
};

// Object emojis with difficulty levels
const OBJECT_EMOJIS = {
  ball: { emoji: '🏀', difficulty: 'medium' },
  bed: { emoji: '🛏️', difficulty: 'easy' },
  book: { emoji: '📚', difficulty: 'medium' },
  hat: { emoji: '🎩', difficulty: 'easy' },
  key: { emoji: '🔑', difficulty: 'medium' },
  kite: { emoji: '🪁', difficulty: 'medium' },
  map: { emoji: '🗺️', difficulty: 'easy' },
  pen: { emoji: '🖊️', difficulty: 'easy' },
  sock: { emoji: '🧦', difficulty: 'medium' }
};

// Nature emojis with difficulty levels
const NATURE_EMOJIS = {
  ice: { emoji: '🧊', difficulty: 'medium' },
  leaf: { emoji: '🍃', difficulty: 'medium' },
  moon: { emoji: '🌙', difficulty: 'medium' },
  rain: { emoji: '🌧️', difficulty: 'medium' },
  snow: { emoji: '❄️', difficulty: 'medium' },
  star: { emoji: '⭐', difficulty: 'easy' },
  sun: { emoji: '☀️', difficulty: 'easy' },
  tree: { emoji: '🌳', difficulty: 'medium' },
  web: { emoji: '🕸️', difficulty: 'easy' }
};

// Food emojis with difficulty levels
const FOOD_EMOJIS = {
  cake: { emoji: '🎂', difficulty: 'medium' },
  egg: { emoji: '🥚', difficulty: 'easy' },
  honey: { emoji: '🍯', difficulty: 'hard' },
  nut: { emoji: '🥜', difficulty: 'easy' },
  pea: { emoji: '🫛', difficulty: 'medium' }
};

// Places emojis with difficulty levels
const PLACES_EMOJIS = {
  house: { emoji: '🏠', difficulty: 'hard' }
};

// Combine all categories into WORD_EMOJIS
const WORD_EMOJIS = {
  ...ANIMAL_EMOJIS,
  ...PEOPLE_AND_BODY_EMOJIS,
  ...TRANSPORT_EMOJIS,
  ...OBJECT_EMOJIS,
  ...NATURE_EMOJIS,
  ...FOOD_EMOJIS,
  ...PLACES_EMOJIS
};

// Add a CSS animation for the tile zoom effect
const zoomToDestinationKeyframes = `
@keyframes zoomToDestination {
  0% {
    transform: scale(0.5);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
`;

// Letter sounds mapping for phonics
const LETTER_SOUNDS = {
  a: { primary: "ah", secondary: "ay" },
  b: { primary: "buh", emphasis: "b-uh" },
  c: { primary: "kuh", secondary: "sss", emphasis: "k-uh" },
  d: { primary: "duh", emphasis: "d-uh" },
  e: { primary: "eh", secondary: "ee" },
  f: { primary: "fff" },
  g: { primary: "guh", secondary: "juh", emphasis: "g-uh" },
  h: { primary: "huh" },
  i: { primary: "ih", secondary: "eye" },
  j: { primary: "juh" },
  k: { primary: "kuh", emphasis: "k-uh" },
  l: { primary: "lll" },
  m: { primary: "mmm" },
  n: { primary: "nnn" },
  o: { primary: "oh", secondary: "oo" },
  p: { primary: "puh", emphasis: "p-uh" },
  q: { primary: "kwuh" },
  r: { primary: "rrr" },
  s: { primary: "sss", secondary: "zzz" },
  t: { primary: "tuh", emphasis: "t-uh" },
  u: { primary: "uh", secondary: "yoo" },
  v: { primary: "vvv" },
  w: { primary: "wuh" },
  x: { primary: "ks", emphasis: "k-s" },
  y: { primary: "yuh", secondary: "eye" },
  z: { primary: "zzz" }
};

// Function to speak a letter name followed by its sound
const speakLetterWithSound = (letter) => {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  // Just speak the letter name clearly
  const nameUtterance = new SpeechSynthesisUtterance(letter);
  nameUtterance.rate = 0.7; // Slower rate for better clarity
  nameUtterance.pitch = 1.1; // Slightly higher pitch for emphasis
  nameUtterance.volume = 1.0; // Full volume
  
  // Queue the utterance
  window.speechSynthesis.speak(nameUtterance);
};

function App() {
  const [placedTiles, setPlacedTiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [gameMode, setGameMode] = useState('playground'); // 'playground' or 'game'
  const [currentGameWord, setCurrentGameWord] = useState('');
  const [currentGameEmoji, setCurrentGameEmoji] = useState('');
  const [showHints, setShowHints] = useState(true);
  const [incorrectTiles, setIncorrectTiles] = useState([]);
  const [difficultyLevel, setDifficultyLevel] = useState('all'); // 'all', 'easy', 'medium', or 'hard'
  
  // Create the full alphabet
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  
  // Function to select a random word for the game mode
  const selectRandomWord = () => {
    // Filter words by difficulty if a specific level is selected
    const words = Object.entries(WORD_EMOJIS).filter(([word, data]) => {
      return difficultyLevel === 'all' || data.difficulty === difficultyLevel;
    }).map(([word]) => word);
    
    // If no words match the difficulty filter, use all words
    const wordsToUse = words.length > 0 ? words : Object.keys(WORD_EMOJIS);
    
    const randomIndex = Math.floor(Math.random() * wordsToUse.length);
    const selectedWord = wordsToUse[randomIndex];
    setCurrentGameWord(selectedWord);
    setCurrentGameEmoji(WORD_EMOJIS[selectedWord].emoji);
    setIncorrectTiles([]);
    
    // First speak the instruction
    const instructionUtterance = new SpeechSynthesisUtterance("Spell the word:");
    instructionUtterance.rate = 0.8;
    
    // Then speak the word slowly
    const wordUtterance = new SpeechSynthesisUtterance(selectedWord);
    wordUtterance.rate = 0.6; // Slower rate for better clarity
    
    // Queue both utterances
    window.speechSynthesis.speak(instructionUtterance);
    
    // Add a slight delay before speaking the word
    instructionUtterance.onend = () => {
      setTimeout(() => {
        window.speechSynthesis.speak(wordUtterance);
      }, 300);
    };
  };
  
  // Initialize a random word when game mode is selected
  useEffect(() => {
    if (gameMode === 'game') {
      setPlacedTiles([]);
      setIncorrectTiles([]);
      selectRandomWord();
    }
  }, [gameMode, difficultyLevel]);
  
  const handleAddTile = (letter) => {
    // Check if we've reached the maximum number of tiles
    if (placedTiles.length >= 9) {
      console.log('Maximum tiles reached (9)');
      return;
    }
    
    // Generate a unique ID for this tile instance
    const uniqueId = `${letter.toLowerCase()}-${Date.now()}`;
    
    // Add the tile to the end of the placed tiles
    setPlacedTiles(prev => {
      const newPlacedTiles = [...prev, uniqueId];
      
      // Reset incorrect tiles when a new tile is added
      setIncorrectTiles([]);
      
      return newPlacedTiles;
    });
    
    playSound('place');
  };

  const handleRemoveTile = (index) => {
    setPlacedTiles(prev => prev.filter((_, i) => i !== index));
    setIncorrectTiles(prev => prev.filter(i => i !== index));
    playSound('remove');
  };

  const handleSpeakWord = () => {
    if (placedTiles.length === 0) return;
    
    // Extract just the letters from the tile IDs to form the word
    const word = placedTiles.map(id => id.split('-')[0]).join('').toLowerCase();
    
    if (gameMode === 'playground' && WORD_EMOJIS[word]) {
      setCurrentWord(word);
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
      setShowModal(true);
    } else {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    
    // If in game mode, select a new word after closing the modal
    if (gameMode === 'game') {
      setPlacedTiles([]);
      setIncorrectTiles([]);
      selectRandomWord();
    }
  };

  const handleClearAll = () => {
    setPlacedTiles([]);
    setIncorrectTiles([]);
    playSound('clear');
  };
  
  const playSound = (type) => {
    // Simple audio feedback (could be implemented with actual sound files)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'place':
        oscillator.frequency.value = 300;
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 150);
        break;
      case 'remove':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 150);
        break;
      case 'clear':
        oscillator.frequency.value = 150;
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 300);
        break;
      case 'incorrect':
        // Play a descending tone for incorrect answers
        oscillator.frequency.value = 400;
        gainNode.gain.value = 0.1;
        oscillator.start();
        
        // Create a descending tone effect
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.3);
        
        setTimeout(() => oscillator.stop(), 300);
        break;
    }
  };

  const toggleGameMode = () => {
    setGameMode(prev => prev === 'playground' ? 'game' : 'playground');
    setPlacedTiles([]);
    setIncorrectTiles([]);
  };
  
  const toggleHints = () => {
    setShowHints(prev => !prev);
  };
  
  const handleDifficultyChange = (level) => {
    setDifficultyLevel(level);
    setPlacedTiles([]);
    setIncorrectTiles([]);
    if (gameMode === 'game') {
      selectRandomWord();
    }
  };
  
  const handleCheckSpelling = () => {
    if (placedTiles.length === 0) return;
    
    // Get the current word formed by the tiles
    const currentSpelling = placedTiles.map(id => id.split('-')[0]).join('').toLowerCase();
    
    // Check if the spelling matches the target word
    if (currentSpelling === currentGameWord) {
      // Correct spelling
      const utterance = new SpeechSynthesisUtterance(`Great job! You spelled ${currentGameWord} correctly!`);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
      setShowModal(true);
    } else {
      // Incorrect spelling - identify which tiles are incorrect
      const newIncorrectTiles = [];
      const targetLetters = currentGameWord.split('');
      
      placedTiles.forEach((tileId, index) => {
        const letter = tileId.split('-')[0].toLowerCase();
        // Check if this letter is incorrect at this position
        if (index >= targetLetters.length || letter !== targetLetters[index]) {
          newIncorrectTiles.push(index);
        }
      });
      
      setIncorrectTiles(newIncorrectTiles);
      
      // Provide audio feedback
      const utterance = new SpeechSynthesisUtterance("Not quite right. Try again!");
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
      
      playSound('incorrect');
    }
  };

  return (
    <>
      {/* Add the animation style to the document */}
      <style>{zoomToDestinationKeyframes}</style>
      
      <div style={{
        minHeight: '100vh',
        padding: '10px', // Reduced padding for mobile
        backgroundColor: '#FFF9E6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem', // Reduced gap for mobile
        fontFamily: 'Comic Sans MS, Chalkboard SE, Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        WebkitTouchCallout: 'none', /* iOS Safari */
        WebkitUserSelect: 'none',    /* Safari */
        KhtmlUserSelect: 'none',     /* Konqueror HTML */
        MozUserSelect: 'none',       /* Firefox */
        msUserSelect: 'none',        /* Internet Explorer/Edge */
        userSelect: 'none',          /* Non-prefixed version */
        touchAction: 'manipulation', /* Disable double-tap to zoom */
      }}>
        <h1 style={{ 
          color: '#FF6B6B', 
          textAlign: 'center',
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', // Responsive font size
          textShadow: '2px 2px 0px #FFE66D',
          margin: '0.5rem 0' // Add margin for better spacing on mobile
        }}>
          Phonics {gameMode === 'playground' ? 'Playground' : 'Game'}
        </h1>
        
        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.8rem',
          marginTop: '-1rem'
        }}>
          <button
            onClick={toggleGameMode}
            style={{
              padding: '8px 16px',
              backgroundColor: gameMode === 'playground' ? '#45B7B8' : '#FFE66D',
              color: gameMode === 'playground' ? 'white' : '#333',
              border: 'none',
              borderRadius: '50px',
              fontSize: 'clamp(0.8rem, 3vw, 1rem)',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 0 rgba(0,0,0,0.1)',
              transition: 'all 0.1s ease',
            }}
          >
            {gameMode === 'playground' ? '🎮 Switch to Game Mode' : '🏠 Switch to Playground'}
          </button>
          
          {gameMode === 'game' && (
            <button
              onClick={toggleHints}
              style={{
                padding: '8px 16px',
                backgroundColor: showHints ? '#45B7B8' : '#FFE66D',
                color: showHints ? 'white' : '#333',
                border: 'none',
                borderRadius: '50px',
                fontSize: 'clamp(0.8rem, 3vw, 1rem)',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 0 rgba(0,0,0,0.1)',
                transition: 'all 0.1s ease',
              }}
            >
              {showHints ? '🔍 Hide Hints' : '💡 Show Hints'}
            </button>
          )}
        </div>
        
        {/* Difficulty selector */}
        {gameMode === 'game' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginTop: '-0.5rem'
          }}>
            <span style={{ 
              fontSize: 'clamp(0.8rem, 3vw, 1rem)',
              fontWeight: 'bold',
              color: '#333',
              alignSelf: 'center'
            }}>
              Difficulty:
            </span>
            {['all', 'easy', 'medium', 'hard'].map(level => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: difficultyLevel === level ? '#FF6B6B' : '#FFE66D',
                  color: difficultyLevel === level ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 0 rgba(0,0,0,0.1)',
                  transition: 'all 0.1s ease',
                  textTransform: 'capitalize'
                }}
              >
                {level === 'all' ? 'All Levels' : level}
              </button>
            ))}
          </div>
        )}
        
        <div style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem' // Reduced gap for mobile
        }}>
          {gameMode === 'game' && (
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              border: '3px solid #FFE66D',
              flexWrap: 'wrap',
            }}>
              <div style={{ fontSize: '4rem' }}>{currentGameEmoji}</div>
              <button
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(currentGameWord);
                  utterance.rate = 0.6; // Slower rate for better clarity
                  window.speechSynthesis.speak(utterance);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#45B7B8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: 'clamp(0.8rem, 3vw, 1rem)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 0 rgba(0,0,0,0.1)',
                }}
              >
                🔊 Repeat Word
              </button>
            </div>
          )}
          
          <WordArea 
            placedTiles={placedTiles} 
            onRemoveTile={handleRemoveTile}
            gameMode={gameMode}
            targetWord={currentGameWord}
            showHints={showHints}
            incorrectTiles={incorrectTiles}
          />
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.8rem', // Reduced gap for mobile
            flexWrap: 'wrap', // Allow buttons to wrap on very small screens
            padding: '0 10px' // Add padding for touch targets
          }}>
            {gameMode === 'playground' && (
              <button 
                onClick={handleSpeakWord}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#45B7B8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: 'clamp(1rem, 4vw, 1.2rem)', // Responsive font size
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 0 #2C8C8D',
                  transition: 'all 0.1s ease',
                  transform: 'translateY(0)',
                  minWidth: '140px', // Ensure minimum touch target size
                  minHeight: '44px', // Ensure minimum touch target size
                  ':active': {
                    transform: 'translateY(4px)',
                    boxShadow: '0 0 0 #2C8C8D',
                  }
                }}
                disabled={placedTiles.length === 0}
              >
                Speak Word 🔊
              </button>
            )}
            
            {gameMode === 'game' && (
              <button 
                onClick={handleCheckSpelling}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: 'clamp(1rem, 4vw, 1.2rem)', // Responsive font size
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 0 #2E7D32',
                  transition: 'all 0.1s ease',
                  transform: 'translateY(0)',
                  minWidth: '140px', // Ensure minimum touch target size
                  minHeight: '44px', // Ensure minimum touch target size
                  ':active': {
                    transform: 'translateY(4px)',
                    boxShadow: '0 0 0 #2E7D32',
                  }
                }}
                disabled={placedTiles.length === 0}
              >
                Check Spelling ✓
              </button>
            )}
            
            <button 
              onClick={handleClearAll}
              style={{
                padding: '12px 24px',
                backgroundColor: '#FF6B6B',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: 'clamp(1rem, 4vw, 1.2rem)', // Responsive font size
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #C74B4B',
                transition: 'all 0.1s ease',
                transform: 'translateY(0)',
                minWidth: '140px', // Ensure minimum touch target size
                minHeight: '44px', // Ensure minimum touch target size
                ':active': {
                  transform: 'translateY(4px)',
                  boxShadow: '0 0 0 #C74B4B',
                }
              }}
              disabled={placedTiles.length === 0}
            >
              Clear All 🧹
            </button>
          </div>
          
          <AlphabetTileGrid 
            alphabet={alphabet}
            onAddTile={handleAddTile}
          />
        </div>
        
        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              maxWidth: '90%',
              width: '400px',
              animation: 'modalPop 0.3s ease-out',
            }}>
              <div style={{
                fontSize: '8rem',
                lineHeight: 1,
              }}>
                {gameMode === 'playground' ? WORD_EMOJIS[currentWord].emoji : currentGameEmoji}
              </div>
              
              <h2 style={{
                fontSize: '2.5rem',
                color: '#FF6B6B',
                margin: 0,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>
                {gameMode === 'playground' ? currentWord : currentGameWord}
              </h2>
              
              {/* Display difficulty badge */}
              <div style={{
                padding: '5px 12px',
                backgroundColor: 
                  (gameMode === 'playground' ? WORD_EMOJIS[currentWord].difficulty : WORD_EMOJIS[currentGameWord].difficulty) === 'easy' ? '#4CAF50' :
                  (gameMode === 'playground' ? WORD_EMOJIS[currentWord].difficulty : WORD_EMOJIS[currentGameWord].difficulty) === 'medium' ? '#FF9800' : 
                  '#F44336',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
                {gameMode === 'playground' ? WORD_EMOJIS[currentWord].difficulty : WORD_EMOJIS[currentGameWord].difficulty} LEVEL
              </div>
              
              <button 
                onClick={handleCloseModal}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s ease',
                }}
              >
                ✓
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style>
        {`
          @keyframes modalPop {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes letterPulse {
            0% { box-shadow: 0 0 5px rgba(255,107,107,0.5); }
            50% { box-shadow: 0 0 15px rgba(255,107,107,0.8); }
            100% { box-shadow: 0 0 5px rgba(255,107,107,0.5); }
          }
        `}
      </style>
    </>
  );
}

// Simplified AlphabetTileGrid without drag functionality
function AlphabetTileGrid({ alphabet, onAddTile }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [speakingLetter, setSpeakingLetter] = useState(null);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLetterSpeak = (letter) => {
    setSpeakingLetter(letter.toLowerCase());
    
    // Reset the speaking letter after animation completes
    setTimeout(() => {
      setSpeakingLetter(null);
    }, 1000); // Duration of speaking animation
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isSmallScreen 
        ? 'repeat(auto-fill, minmax(60px, 1fr))'
        : 'repeat(auto-fill, minmax(80px, 1fr))',
      gap: isSmallScreen ? '0.5rem' : '1rem',
      padding: isSmallScreen ? '1rem' : '1.5rem',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      border: '3px solid #FFE66D',
    }}>
      {alphabet.split('').map(letter => (
        <LetterTile 
          key={letter}
          letter={letter}
          isSmallScreen={isSmallScreen}
          onAddTile={onAddTile}
          onSpeak={handleLetterSpeak}
          isSpeaking={speakingLetter === letter.toLowerCase()}
        />
      ))}
    </div>
  );
}

// Simplified LetterTile without drag functionality
function LetterTile({ letter, isSmallScreen, onAddTile, onSpeak, isSpeaking }) {
  const size = isSmallScreen ? '60px' : '70px';

  const handleTileClick = () => {
    // Speak the letter name when tapped
    speakLetterWithSound(letter);
    
    // Notify parent about speaking
    onSpeak(letter);
    
    // Call the original onAddTile function
    onAddTile(letter);
  };

  return (
    <div 
      onClick={handleTileClick}
      style={{
        width: size,
        height: size,
        backgroundColor: isSpeaking ? '#FFA726' : '#FFE66D', // Highlight when speaking
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isSmallScreen ? '2rem' : '2.5rem',
        fontWeight: 'bold',
        color: '#333333',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
        border: isSpeaking ? '3px solid #FF6B6B' : '3px solid rgba(255,255,255,0.5)',
        boxShadow: isSpeaking ? '0 0 10px rgba(255,107,107,0.7)' : '0 4px 0 rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        animation: isSpeaking ? 'letterPulse 1s infinite' : 'none',
        transform: isSpeaking ? 'scale(1.05)' : 'scale(1)',
        ':active': {
          transform: 'translateY(4px)',
          boxShadow: '0 0 0 rgba(0,0,0,0.1)',
        }
      }}
    >
      {letter.toUpperCase()}
    </div>
  );
}

// Simplified WordArea without drag functionality
function WordArea({ placedTiles, onRemoveTile, gameMode, targetWord, showHints, incorrectTiles }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Create ghost tiles for game mode
  const renderGhostTiles = () => {
    if (gameMode !== 'game' || !showHints || !targetWord) return null;
    
    // Get the letters that have already been placed
    const placedLetters = placedTiles.map(id => id.split('-')[0].toLowerCase());
    
    // Create ghost tiles for the remaining letters
    return targetWord.split('').map((letter, index) => {
      // If we already have a placed tile at this position, don't show a ghost
      if (index < placedLetters.length) return null;
      
      return (
        <div
          key={`ghost-${index}`}
          style={{
            width: isSmallScreen ? '60px' : '70px',
            height: isSmallScreen ? '60px' : '70px',
            backgroundColor: 'transparent',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isSmallScreen ? '2rem' : '2.5rem',
            fontWeight: 'bold',
            color: 'rgba(200, 200, 200, 0.3)',
            border: '3px dashed rgba(200, 200, 200, 0.3)',
            margin: '0 4px',
          }}
        >
          {letter.toUpperCase()}
        </div>
      );
    });
  };

  return (
    <div 
      style={{
        minHeight: isSmallScreen ? '120px' : '150px', // Fixed height to prevent layout shifts
        height: gameMode === 'game' ? (isSmallScreen ? '120px' : '150px') : 'auto', // Fixed height in game mode
        backgroundColor: 'white',
        border: '4px dashed #FFE66D',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        padding: isSmallScreen ? '1rem' : '1.5rem',
        gap: '0.5rem',
        position: 'relative',
        flexWrap: 'wrap',
        overflow: 'auto', // Add scrolling if content overflows
      }}
      role="region" 
      aria-label="Letter tiles area"
    >
      {gameMode === 'game' && showHints && placedTiles.length === 0 ? (
        // Show ghost tiles when in game mode with hints and no tiles placed yet
        renderGhostTiles()
      ) : (
        // Show placed tiles
        placedTiles.map((tileId, index) => (
          <PlacedTile 
            key={`${tileId}-${index}`}
            letter={tileId.split('-')[0].toUpperCase()}
            index={index}
            onRemoveTile={onRemoveTile}
            isSmallScreen={isSmallScreen}
            incorrect={incorrectTiles.includes(index)}
          />
        ))
      )}
      
      {/* Show ghost tiles after the placed tiles in game mode */}
      {gameMode === 'game' && showHints && placedTiles.length > 0 && placedTiles.length < targetWord.length && (
        renderGhostTiles()
      )}
    </div>
  );
}

// Simplified PlacedTile without drag functionality
function PlacedTile({ letter, index, onRemoveTile, isSmallScreen, incorrect }) {
  const [isNew, setIsNew] = useState(true);
  
  // Set isNew to false after the animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 300); // Match animation duration
    return () => clearTimeout(timer);
  }, []);
  
  const size = isSmallScreen ? '60px' : '70px';

  return (
    <div
      onClick={() => onRemoveTile(index)}
      style={{
        width: size,
        height: size,
        backgroundColor: incorrect ? '#FF6B6B' : '#D7C0E0',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isSmallScreen ? '2rem' : '2.5rem',
        fontWeight: 'bold',
        color: '#333333',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
        boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
        border: '3px solid rgba(255,255,255,0.5)',
        // Apply animation for new tiles
        animation: isNew ? 'zoomToDestination 0.3s ease-out' : 'none',
        transition: 'transform 0.1s ease',
        ':active': {
          transform: 'translateY(4px)',
          boxShadow: '0 0 0 rgba(0,0,0,0.1)',
        }
      }}
    >
      {letter}
    </div>
  );
}

export default App; 