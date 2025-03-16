import React, { useState, useEffect, useRef } from 'react';
import { 
  WORD_EMOJIS, 
  getEmojisByDifficulty 
} from './data/emoji';

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
  const [difficultyLevel, setDifficultyLevel] = useState('easy'); // Changed from 'all' to 'easy'
  const [useUppercase, setUseUppercase] = useState(false); // Changed default to lowercase
  const [inputMode, setInputMode] = useState('tap'); // 'tap' or 'type'
  const [showSettings, setShowSettings] = useState(false); // New state for settings panel
  
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

  const toggleCase = () => {
    setUseUppercase(prev => !prev);
  };

  const toggleInputMode = () => {
    setInputMode(prev => prev === 'tap' ? 'type' : 'tap');
  };
  
  // Add a new function to handle text input changes
  const handleTextInput = (text) => {
    // Convert the text to an array of tiles
    const newTiles = text.split('').map(letter => {
      // Skip non-alphabetic characters
      if (!/[a-zA-Z]/.test(letter)) return null;
      return `${letter.toLowerCase()}-${Date.now() + Math.random() * 1000}`;
    }).filter(Boolean); // Remove null values
    
    // Limit to 12 tiles
    const limitedTiles = newTiles.slice(0, 12);
    
    // Update the placed tiles
    setPlacedTiles(limitedTiles);
    
    // Reset incorrect tiles
    setIncorrectTiles([]);
  };

  // Add a function to toggle settings panel
  const toggleSettings = () => {
    setShowSettings(prev => !prev);
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
        {/* Header with title and settings button */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          maxWidth: '800px', // Match content width
          margin: '0 auto', // Center header
          padding: '0 10px', // prevent touching edges on small screens
        }}>
          <h1 style={{ 
            color: '#FF6B6B', 
            textAlign: 'center',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', // Responsive font size
            textShadow: '2px 2px 0px #FFE66D',
            margin: '0.5rem 0', // better spacing on mobile?
            flex: 1, // title takes up all available space
          }}>
            Phonics {gameMode === 'playground' ? 'Playground' : 'Game'}
          </h1>
          
          {/* Settings gear button */}
          <button
            onClick={toggleSettings}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#FFE66D',
              border: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              marginLeft: '10px', // Space between title and button
              color: '#333',
              flexShrink: 0, // Prevent the button from shrinking on small screens
            }}
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
        
        {/* Mode toggle. Outside settings as I consider it a "primary control" */}
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
          
        </div>
        
        <div style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
          {gameMode === 'game' && (
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem', // Reduced gap from 1rem
              padding: '0.4rem 0.6rem', // Reduced padding from 0.8rem
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              border: '3px solid #FFE66D',
              flexWrap: 'wrap',
            }}>
              <div style={{ fontSize: '4rem', margin: '0', lineHeight: '1' }}>{currentGameEmoji}</div>
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
            useUppercase={useUppercase}
            inputMode={inputMode}
            onTextInput={handleTextInput}
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
            useUppercase={useUppercase}
          />
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '300px',
            height: '100%',
            backgroundColor: 'white',
            boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
            zIndex: 100,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'slideIn 0.3s ease-out',
            overflowY: 'auto',
          }}>
            {/* Settings Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #FFE66D',
              paddingBottom: '10px',
            }}>
              <h2 style={{ 
                margin: 0, 
                color: '#45B7B8',
                fontSize: '1.5rem',
              }}>
                Settings ⚙️
              </h2>
              <button
                onClick={toggleSettings}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#FF6B6B',
                }}
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>
            
            {/* Game Mode Settings */}
            {gameMode === 'game' && (
              <>
                {/* Show/Hide Hints Toggle - Moved from main UI */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: '#333',
                    fontSize: '1.2rem',
                  }}>
                    Hints
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                  }}>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: showHints ? 'bold' : 'normal',
                      color: showHints ? '#333' : '#888',
                      userSelect: 'none',
                    }}>
                      💡 Show Hints
                    </span>
                    
                    {/* Toggle switch container */}
                    <div 
                      onClick={toggleHints}
                      style={{
                        width: '50px',
                        height: '26px',
                        backgroundColor: showHints ? '#45B7B8' : '#e0e0e0',
                        borderRadius: '50px',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Toggle switch thumb */}
                      <div
                        style={{
                          position: 'absolute',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          top: '2px',
                          left: showHints ? '26px' : '2px',
                          transition: 'left 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Difficulty Settings */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: '#333',
                    fontSize: '1.2rem',
                  }}>
                    Difficulty Level
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}>
                    {['all', 'easy', 'medium', 'hard'].map(level => (
                      <button
                        key={level}
                        onClick={() => handleDifficultyChange(level)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: difficultyLevel === level ? '#FF6B6B' : '#f0f0f0',
                          color: difficultyLevel === level ? 'white' : '#333',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: difficultyLevel === level ? 'bold' : 'normal',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: difficultyLevel === level ? 'white' : '#ddd',
                          marginRight: '10px',
                          border: difficultyLevel === level ? '2px solid white' : '2px solid #ccc',
                        }}></span>
                        {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {/* Letter Case Toggle */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <h3 style={{ 
                margin: 0, 
                color: '#333',
                fontSize: '1.2rem',
              }}>
                Letter Case
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
              }}>
                {/* Lowercase label */}
                <span style={{
                  fontSize: '1rem',
                  fontWeight: useUppercase ? 'normal' : 'bold',
                  color: useUppercase ? '#888' : '#333',
                  userSelect: 'none',
                }}>
                  🔡 abc
                </span>
                
                {/* Toggle switch container */}
                <div 
                  onClick={toggleCase}
                  style={{
                    width: '50px',
                    height: '26px',
                    backgroundColor: useUppercase ? '#45B7B8' : '#e0e0e0',
                    borderRadius: '50px',
                    position: 'relative',
                    cursor: 'pointer',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Toggle switch thumb */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      top: '2px',
                      left: useUppercase ? '26px' : '2px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  />
                </div>
                
                {/* Uppercase label */}
                <span style={{
                  fontSize: '1rem',
                  fontWeight: useUppercase ? 'bold' : 'normal',
                  color: useUppercase ? '#333' : '#888',
                  userSelect: 'none',
                }}>
                  🔠 ABC
                </span>
              </div>
            </div>
            
            {/* Input Mode Toggle */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <h3 style={{ 
                margin: 0, 
                color: '#333',
                fontSize: '1.2rem',
              }}>
                Input Mode
              </h3>
              <div style={{
                display: 'flex',
                gap: '10px',
              }}>
                <button
                  onClick={() => setInputMode('tap')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: inputMode === 'tap' ? '#9C27B0' : '#f0f0f0',
                    color: inputMode === 'tap' ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>👆</span>
                  Tap Mode
                </button>
                <button
                  onClick={() => setInputMode('type')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: inputMode === 'type' ? '#9C27B0' : '#f0f0f0',
                    color: inputMode === 'type' ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>⌨️</span>
                  Type Mode
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay to close settings when clicking outside */}
        {showSettings && (
          <div 
            onClick={toggleSettings}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 99,
            }}
          />
        )}
        
        {/* Word Modal - Adding back the modal that was removed */}
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
              }}>
                {gameMode === 'playground' 
                  ? (useUppercase ? currentWord.toUpperCase() : currentWord.toLowerCase())
                  : (useUppercase ? currentGameWord.toUpperCase() : currentGameWord.toLowerCase())
                }
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
          
          @keyframes slideIn {
            0% { transform: translateX(100%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </>
  );
}

// Simplified AlphabetTileGrid without drag functionality
function AlphabetTileGrid({ alphabet, onAddTile, useUppercase }) {
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
        ? 'repeat(auto-fill, minmax(50px, 1fr))'
        : 'repeat(auto-fill, minmax(65px, 1fr))',
      gap: isSmallScreen ? '0.3rem' : '0.6rem',
      padding: isSmallScreen ? '0.8rem' : '1.2rem',
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
          useUppercase={useUppercase}
        />
      ))}
    </div>
  );
}

// Simplified LetterTile without drag functionality
function LetterTile({ letter, isSmallScreen, onAddTile, onSpeak, isSpeaking, useUppercase }) {
  const size = isSmallScreen ? '50px' : '60px';

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
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isSmallScreen ? '1.6rem' : '2rem',
        fontWeight: 'bold',
        color: '#333333',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
        border: isSpeaking ? '3px solid #FF6B6B' : '2px solid rgba(255,255,255,0.5)',
        boxShadow: isSpeaking ? '0 0 10px rgba(255,107,107,0.7)' : '0 3px 0 rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        animation: isSpeaking ? 'letterPulse 1s infinite' : 'none',
        transform: isSpeaking ? 'scale(1.05)' : 'scale(1)',
        ':active': {
          transform: 'translateY(3px)',
          boxShadow: '0 0 0 rgba(0,0,0,0.1)',
        }
      }}
    >
      {useUppercase ? letter.toUpperCase() : letter.toLowerCase()}
    </div>
  );
}

// Simplified WordArea without drag functionality
function WordArea({ placedTiles, onRemoveTile, gameMode, targetWord, showHints, incorrectTiles, useUppercase, inputMode, onTextInput }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);
  
  // Update inputText when placedTiles changes (for synchronization)
  useEffect(() => {
    if (inputMode === 'type') {
      const text = placedTiles.map(id => id.split('-')[0]).join('');
      setInputText(text);
    }
  }, [placedTiles, inputMode]);
  
  // Focus the input field when switching to type mode
  useEffect(() => {
    if (inputMode === 'type' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputMode]);
  
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
            width: isSmallScreen ? '50px' : '60px',
            height: isSmallScreen ? '50px' : '60px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isSmallScreen ? '1.6rem' : '2rem',
            fontWeight: 'bold',
            color: 'rgba(200, 200, 200, 0.3)',
            border: '2px dashed rgba(200, 200, 200, 0.3)',
            margin: '0 3px',
          }}
        >
          {useUppercase ? letter.toUpperCase() : letter.toLowerCase()}
        </div>
      );
    });
  };
  
  const handleInputChange = (e) => {
    const text = e.target.value;
    
    // Filter out non-alphabetic characters
    const filteredText = text.replace(/[^a-zA-Z]/g, '');
    
    // Limit to 12 characters
    const limitedText = filteredText.slice(0, 12);
    
    setInputText(limitedText);
    onTextInput(limitedText);
  };

  // Get placeholder text based on game mode
  const getPlaceholderText = () => {
    if (gameMode === 'game' && targetWord) {
      return `Type "${useUppercase ? targetWord.toUpperCase() : targetWord}"`;
    } else {
      return "Type to add letters";
    }
  };

  return (
    <div 
      style={{
        minHeight: isSmallScreen ? '90px' : '110px', // Further reduced height
        height: gameMode === 'game' ? (isSmallScreen ? '90px' : '110px') : 'auto', // Further reduced height in game mode
        backgroundColor: 'white',
        border: inputMode === 'type' ? '3px solid #9C27B0' : '3px dashed #FFE66D', // Thinner border
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        padding: isSmallScreen ? '0.5rem' : '0.8rem', // Further reduced padding
        gap: '0.3rem', // Further reduced gap
        position: 'relative',
        flexWrap: 'wrap',
        overflow: 'auto', // Add scrolling if content overflows
      }}
      role="region" 
      aria-label="Letter tiles area"
    >
      {inputMode === 'type' ? (
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder={getPlaceholderText()}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: isSmallScreen ? '1.6rem' : '2rem',
            fontWeight: 'bold',
            color: '#333333',
            textAlign: 'center',
            fontFamily: 'inherit',
            textTransform: useUppercase ? 'uppercase' : 'lowercase',
          }}
          maxLength={12}
          aria-label="Type letters here"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
        />
      ) : (
        <>
          {gameMode === 'game' && showHints && placedTiles.length === 0 ? (
            // Show ghost tiles when in game mode with hints and no tiles placed yet
            renderGhostTiles()
          ) : (
            // Show placed tiles
            placedTiles.map((tileId, index) => (
              <PlacedTile 
                key={`${tileId}-${index}`}
                letter={tileId.split('-')[0]}
                index={index}
                onRemoveTile={onRemoveTile}
                isSmallScreen={isSmallScreen}
                incorrect={incorrectTiles.includes(index)}
                useUppercase={useUppercase}
              />
            ))
          )}
          
          {/* Show ghost tiles after the placed tiles in game mode */}
          {gameMode === 'game' && showHints && placedTiles.length > 0 && placedTiles.length < targetWord.length && (
            renderGhostTiles()
          )}
        </>
      )}
    </div>
  );
}

// Simplified PlacedTile without drag functionality
function PlacedTile({ letter, index, onRemoveTile, isSmallScreen, incorrect, useUppercase }) {
  const [isNew, setIsNew] = useState(true);
  
  // Set isNew to false after the animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 300); // Match animation duration
    return () => clearTimeout(timer);
  }, []);
  
  const size = isSmallScreen ? '50px' : '60px';

  return (
    <div
      onClick={() => onRemoveTile(index)}
      style={{
        width: size,
        height: size,
        backgroundColor: incorrect ? '#FF6B6B' : '#D7C0E0',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isSmallScreen ? '1.6rem' : '2rem',
        fontWeight: 'bold',
        color: '#333333',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
        boxShadow: '0 3px 0 rgba(0,0,0,0.1)',
        border: '2px solid rgba(255,255,255,0.5)',
        // Apply animation for new tiles
        animation: isNew ? 'zoomToDestination 0.3s ease-out' : 'none',
        transition: 'transform 0.1s ease',
        ':active': {
          transform: 'translateY(3px)',
          boxShadow: '0 0 0 rgba(0,0,0,0.1)',
        }
      }}
    >
      {useUppercase ? letter.toUpperCase() : letter.toLowerCase()}
    </div>
  );
}

export default App; 