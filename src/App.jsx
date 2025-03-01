import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  closestCenter, 
  pointerWithin,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  tongue: '👅',
  hair: '👱‍♂️',
  hat: '🎩',
};

function App() {
  const [placedTiles, setPlacedTiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [tileCounts, setTileCounts] = useState({});
  
  // Create the full alphabet with 9 copies of each letter
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  
  // Configure sensors for both mouse and touch with proper options
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      // Prevent scrolling while dragging
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
  
  // Initialize tile counts on first render
  useEffect(() => {
    const initialCounts = {};
    for (const letter of alphabet) {
      initialCounts[letter] = 3; // Keep at 3 copies of each letter
    }
    setTileCounts(initialCounts);
  }, []);
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over?.id === 'dropzone' && active?.id) {
      // Extract the letter from the active.id (which might be like "a-2")
      const letter = active.id.split('-')[0];
      
      // Check if we already have 9 tiles in the drop zone
      if (placedTiles.length >= 9) {
        // Don't add more than 9 tiles
        return;
      }
      
      // Add the letter to placed tiles
      setPlacedTiles(prev => [...prev, letter]);
      
      // Decrease the count for this letter
      setTileCounts(prev => ({
        ...prev,
        [letter]: Math.max(0, prev[letter] - 1)
      }));
      
      playSound('place');
    } else if (active?.id && !over?.id && placedTiles.includes(active.id)) {
      // Handle dragging a tile out of the dropzone
      const letter = active.id;
      
      // Remove the letter from placed tiles
      setPlacedTiles(prev => prev.filter(tileId => tileId !== letter));
      
      // Increase the count for this letter
      setTileCounts(prev => ({
        ...prev,
        [letter]: prev[letter] + 1
      }));
      
      playSound('remove');
    } else if (over && active && placedTiles.includes(active.id) && placedTiles.includes(over.id)) {
      // Handle reordering within the dropzone
      const oldIndex = placedTiles.indexOf(active.id);
      const newIndex = placedTiles.indexOf(over.id);
      
      if (oldIndex !== newIndex) {
        setPlacedTiles(prev => arrayMove(prev, oldIndex, newIndex));
        playSound('place');
      }
    } else if (over && over.id.startsWith('position-') && active?.id) {
      // Extract the letter from the active.id (which might be like "a-2")
      const letter = active.id.split('-')[0];
      
      // Check if we already have 9 tiles in the drop zone
      if (placedTiles.length >= 9) {
        // Don't add more than 9 tiles
        return;
      }
      
      // Handle dropping a new tile between existing tiles
      const positionIndex = parseInt(over.id.split('-')[1]);
      const newPlacedTiles = [...placedTiles];
      newPlacedTiles.splice(positionIndex, 0, letter);
      setPlacedTiles(newPlacedTiles);
      
      // Decrease the count for this letter
      setTileCounts(prev => ({
        ...prev,
        [letter]: Math.max(0, prev[letter] - 1)
      }));
      
      playSound('place');
    }
  };

  const handleRemoveTile = (index) => {
    // Get the letter being removed
    const letter = placedTiles[index];
    
    // Remove the letter from placed tiles
    setPlacedTiles(prev => prev.filter((_, i) => i !== index));
    
    // Increase the count for this letter
    setTileCounts(prev => ({
      ...prev,
      [letter]: prev[letter] + 1
    }));
    
    playSound('remove');
  };

  const handleSpeakWord = () => {
    if (placedTiles.length === 0) return;
    
    const word = placedTiles.join('').toLowerCase();
    
    // Only show modal if the word is in our emoji dictionary
    if (WORD_EMOJIS[word]) {
      setCurrentWord(word);
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8; // Slightly slower for children
      window.speechSynthesis.speak(utterance);
      
      setShowModal(true);
    } else {
      // Just speak the word without showing modal
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClearAll = () => {
    // Return all placed tiles to the available pool
    placedTiles.forEach(letter => {
      setTileCounts(prev => ({
        ...prev,
        [letter]: prev[letter] + 1
      }));
    });
    
    setPlacedTiles([]);
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
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragEnd={handleDragEnd} 
      collisionDetection={closestCenter}
    >
      <div style={{
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#FFF9E6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        fontFamily: 'Comic Sans MS, Chalkboard SE, Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 style={{ 
          color: '#FF6B6B', 
          textAlign: 'center',
          fontSize: '2.5rem',
          textShadow: '2px 2px 0px #FFE66D'
        }}>
          Phonics Playground
        </h1>
        
        <div style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <DropZone 
            placedTiles={placedTiles} 
            onRemoveTile={handleRemoveTile}
          />
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <button 
              onClick={handleSpeakWord}
              style={{
                padding: '12px 24px',
                backgroundColor: '#45B7B8',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #2C8C8D',
                transition: 'all 0.1s ease',
                transform: 'translateY(0)',
                ':active': {
                  transform: 'translateY(4px)',
                  boxShadow: '0 0 0 #2C8C8D',
                }
              }}
              disabled={placedTiles.length === 0}
            >
              Speak Word 🔊
            </button>
            
            <button 
              onClick={handleClearAll}
              style={{
                padding: '12px 24px',
                backgroundColor: '#FF6B6B',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #C74B4B',
                transition: 'all 0.1s ease',
                transform: 'translateY(0)',
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
            tileCounts={tileCounts}
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
                {WORD_EMOJIS[currentWord]}
              </div>
              
              <h2 style={{
                fontSize: '2.5rem',
                color: '#FF6B6B',
                margin: 0,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>
                {currentWord}
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
    </DndContext>
  );
}

// New AlphabetTileGrid component for stacked letters
function AlphabetTileGrid({ alphabet, tileCounts }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
      gap: '1rem',
      padding: '1.5rem',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      border: '3px solid #FFE66D',
    }}>
      {alphabet.split('').map(letter => (
        <LetterStack 
          key={letter}
          letter={letter}
          count={tileCounts[letter] || 0}
        />
      ))}
    </div>
  );
}

// LetterStack component for stacked tiles
function LetterStack({ letter, count }) {
  // Determine how many tiles to show in the stack (max 3 visually)
  const visibleCount = Math.min(count, 3);
  
  return (
    <div style={{
      position: 'relative',
      height: '80px',
      width: '70px',
    }}>
      {/* Show stacked tiles based on visible count */}
      {Array.from({ length: visibleCount }).map((_, index) => {
        // Calculate offset for stacking effect
        const offset = (2 - index) * 3;
        
        return (
          <StackedTile 
            key={`${letter}-${index}`}
            id={`${letter}-${index}`}
            letter={letter.toUpperCase()}
            style={{
              position: 'absolute',
              top: `${offset}px`,
              left: `${offset}px`,
              zIndex: index,
            }}
            disabled={index !== visibleCount - 1} // Only the top tile is draggable
          />
        );
      })}
      
      {/* Show count indicator if there are tiles */}
      {count > 0 && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: '#FF6B6B',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 5,
        }}>
          {count}
        </div>
      )}
    </div>
  );
}

// StackedTile component
function StackedTile({ id, letter, style, disabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    disabled,
  });

  const tileStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        ...tileStyle,
        width: '70px',
        height: '70px',
        backgroundColor: isDragging ? '#B8E6B3' : '#A8D5E5',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#333333',
        cursor: disabled ? 'default' : 'grab',
        userSelect: 'none',
        transition: isDragging ? 'none' : 'background-color 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
        border: '3px solid rgba(255,255,255,0.5)',
        opacity: disabled ? 0.8 : 1,
      }}
      {...(disabled ? {} : { ...listeners, ...attributes })}
    >
      {letter}
    </div>
  );
}

// Tile component
function Tile({ id, letter }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        width: '70px',
        height: '70px',
        backgroundColor: isDragging ? '#B8E6B3' : '#A8D5E5',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#333333',
        cursor: 'grab',
        userSelect: 'none',
        transition: isDragging ? 'none' : 'background-color 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
        border: '3px solid rgba(255,255,255,0.5)',
      }}
      {...listeners}
      {...attributes}
    >
      {letter}
    </div>
  );
}

// TileGrid component
function TileGrid({ tiles }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
      gap: '1rem',
      padding: '1.5rem',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      border: '3px solid #FFE66D',
    }}>
      {tiles.map(tile => (
        <Tile 
          key={tile.id} 
          id={tile.id}
          letter={tile.letter}
        />
      ))}
    </div>
  );
}

// DropZone component
function DropZone({ placedTiles, onRemoveTile }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'dropzone',
  });

  return (
    <div 
      ref={setNodeRef} 
      style={{
        minHeight: '120px',
        backgroundColor: 'white',
        border: `4px dashed ${isOver ? '#45B7B8' : '#FFE66D'}`,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        padding: '1.5rem',
        gap: '0.25rem',
        transition: 'border-color 0.3s ease',
        position: 'relative',
        flexWrap: 'wrap', // Allow tiles to wrap to next line if needed
      }}
      role="region" 
      aria-label="Letter tiles drop zone"
    >
      {placedTiles.length === 0 && (
        <div style={{ 
          color: '#999', 
          padding: '1rem',
          fontSize: '1.2rem',
          fontStyle: 'italic'
        }}>
          Drag letters here to build a word (max 9 tiles)
        </div>
      )}
      
      <SortableContext items={placedTiles} strategy={horizontalListSortingStrategy}>
        {placedTiles.map((tileId, index) => (
          <React.Fragment key={`fragment-${tileId}-${index}`}>
            {/* Drop position indicator before each tile */}
            {index === 0 && <DropPositionIndicator index={0} />}
            
            <SortableTile 
              key={`${tileId}-${index}`}
              id={tileId}
              letter={tileId.toUpperCase()}
              index={index}
              onRemoveTile={onRemoveTile}
            />
            
            {/* Drop position indicator after each tile */}
            <DropPositionIndicator index={index + 1} />
          </React.Fragment>
        ))}
        
        {/* If no tiles, add a single drop position */}
        {placedTiles.length === 0 && <DropPositionIndicator index={0} />}
      </SortableContext>
    </div>
  );
}

// New component for drop position indicators
function DropPositionIndicator({ index }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `position-${index}`,
  });
  
  return (
    <div
      ref={setNodeRef}
      style={{
        width: '5px',
        height: '70px',
        backgroundColor: isOver ? 'rgba(69, 183, 184, 0.3)' : 'transparent',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
      }}
    />
  );
}

// Replace DraggableTile with SortableTile
function SortableTile({ id, letter, index, onRemoveTile }) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging 
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '70px',
    height: '70px',
    backgroundColor: isDragging ? '#B8E6B3' : '#D7C0E0',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333333',
    cursor: 'grab',
    userSelect: 'none',
    zIndex: isDragging ? 10 : 1,
    boxShadow: isDragging 
      ? '0 8px 16px rgba(0,0,0,0.2)' 
      : '0 4px 0 rgba(0,0,0,0.1)',
    border: '3px solid rgba(255,255,255,0.5)',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onRemoveTile(index)}
      {...attributes}
      {...listeners}
    >
      {letter}
    </div>
  );
}

export default App; 