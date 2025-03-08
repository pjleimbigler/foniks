import React, { useState, useEffect } from 'react';

// Reworked emoji associations for complete words
const WORD_EMOJIS = {
  cat: '🐱',
  dog: '🐶',
  fish: '🐟',
  bear: '🐻',
  lion: '🦁',
  wolf: '🐺',
  fox: '🦊',
  owl: '🦉',
  pig: '🐷',
  frog: '🐸',
  duck: '🦆',
  bird: '🐦',
  cow: '🐄',
  goat: '🐐',
  ship: '🚢',
  boat: '⛵',
  car: '🚗',
  bus: '🚌',
  hat: '🎩',
  sock: '🧦',
  sun: '☀️',
  moon: '🌙',
  star: '⭐',
  cake: '🎂',
  gift: '🎁',
  ball: '🏀',
  book: '📚',
  pen: '🖊️',
  house: '🏠',
  tree: '🌳',
  // New simple emoji words
  bed: '🛏️',
  bug: '🐛',
  ant: '🐜',
  bee: '🐝',
  egg: '🥚',
  ice: '🧊',
  honey: '🍯',
  key: '🔑',
  map: '🗺️',
  nut: '🥜',
  pea: '🫛',
  web: '🕸️',
  yak: '🦬',
  giraffe: '🦒',
  kite: '🪁',
  rain: '🌧️',
  snow: '❄️',
  leaf: '🍃',
  hand: '👋',
  foot: '🦶',
  ear: '👂',
  eye: '👁️',
  nose: '👃',
  mouth: '👄',
  tooth: '🦷',
  tongue: '👅'
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

function App() {
  const [placedTiles, setPlacedTiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [gameMode, setGameMode] = useState('playground'); // 'playground' or 'game'
  const [currentGameWord, setCurrentGameWord] = useState('');
  const [currentGameEmoji, setCurrentGameEmoji] = useState('');
  const [showHints, setShowHints] = useState(true);
  const [incorrectTiles, setIncorrectTiles] = useState([]);
  
  // Create the full alphabet
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  
  // Function to select a random word for the game mode
  const selectRandomWord = () => {
    const words = Object.keys(WORD_EMOJIS);
    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWord = words[randomIndex];
    setCurrentGameWord(selectedWord);
    setCurrentGameEmoji(WORD_EMOJIS[selectedWord]);
    setIncorrectTiles([]);
    
    // Speak the prompt
    const utterance = new SpeechSynthesisUtterance(`Spell the word: ${selectedWord}`);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };
  
  // Initialize a random word when game mode is selected
  useEffect(() => {
    if (gameMode === 'game') {
      setPlacedTiles([]);
      setIncorrectTiles([]);
      selectRandomWord();
    }
  }, [gameMode]);
  
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
                  const utterance = new SpeechSynthesisUtterance(`Spell the word: ${currentGameWord}`);
                  utterance.rate = 0.8;
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
                {gameMode === 'playground' ? WORD_EMOJIS[currentWord] : currentGameEmoji}
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
        `}
      </style>
    </>
  );
}

// Simplified AlphabetTileGrid without drag functionality
function AlphabetTileGrid({ alphabet, onAddTile }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
        />
      ))}
    </div>
  );
}

// Simplified LetterTile without drag functionality
function LetterTile({ letter, isSmallScreen, onAddTile }) {
  const size = isSmallScreen ? '60px' : '70px';

  const handleTileClick = () => {
    // Speak the letter name when tapped
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
    
    // Call the original onAddTile function
    onAddTile(letter);
  };

  return (
    <div 
      onClick={handleTileClick}
      style={{
        width: size,
        height: size,
        backgroundColor: '#FFE66D',
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
        border: '3px solid rgba(255,255,255,0.5)',
        boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
        transition: 'transform 0.1s ease',
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