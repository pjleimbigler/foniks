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

// Animal emojis
const ANIMAL_EMOJIS = {
  ant: '🐜',
  bear: '🐻',
  bee: '🐝',
  bird: '🐦',
  bug: '🐛',
  cat: '🐱',
  cow: '🐄',
  dog: '🐶',
  duck: '🦆',
  fish: '🐟',
  fox: '🦊',
  frog: '🐸',
  giraffe: '🦒',
  goat: '🐐',
  lion: '🦁',
  owl: '🦉',
  pig: '🐷',
  wolf: '🐺',
  yak: '🦬'
};

// People and body parts emojis
const PEOPLE_AND_BODY_EMOJIS = {
  ear: '👂',
  eye: '👁️',
  foot: '🦶',
  hand: '👋',
  mouth: '👄',
  nose: '👃',
  tongue: '👅',
  tooth: '🦷'
};

// Transportation emojis
const TRANSPORT_EMOJIS = {
  boat: '⛵',
  bus: '🚌',
  car: '🚗',
  ship: '🚢'
};

// Object emojis
const OBJECT_EMOJIS = {
  ball: '🏀',
  bed: '🛏️',
  book: '📚',
  hat: '🎩',
  key: '🔑',
  kite: '🪁',
  map: '🗺️',
  pen: '🖊️',
  sock: '🧦'
};

// Nature emojis
const NATURE_EMOJIS = {
  ice: '🧊',
  leaf: '🍃',
  moon: '🌙',
  rain: '🌧️',
  snow: '❄️',
  star: '⭐',
  sun: '☀️',
  tree: '🌳',
  web: '🕸️'
};

// Food emojis
const FOOD_EMOJIS = {
  cake: '🎂',
  egg: '🥚',
  honey: '🍯',
  nut: '🥜',
  pea: '🫛'
};

// Places emojis
const PLACES_EMOJIS = {
  house: '🏠'
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

function App() {
  const [placedTiles, setPlacedTiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  
  // Create the full alphabet
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  
  // Configure sensors for both mouse and touch with proper options
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
  
  const handleDragEnd = (event) => {
    console.log('=== Drag End Event ===');
    console.log('Event:', event);
    console.log('Active:', event.active);
    console.log('Over:', event.over);
    
    const { active, over } = event;
    
    // If no active item, return early
    if (!active) {
      console.log('No active item, returning');
      return;
    }
    
    // Handle click events (no activatorEvent)
    if (!event.activatorEvent) {
      console.log('Click event detected');
      if (placedTiles.length >= 9) return;
      
      const uniqueId = `${active.id.split('-')[0]}-${Date.now()}`;
      setPlacedTiles(prev => {
        const newTiles = [...prev, uniqueId];
        console.log('Added tile via click:', uniqueId);
        return newTiles;
      });
      playSound('place');
      return;
    }
    
    // Handle drag events
    if (over && (over.id === 'dropzone' || over.id.startsWith('position-'))) {
      console.log('Valid drop detected:', over.id);
      if (placedTiles.length >= 9) {
        console.log('Dropzone full');
        return;
      }
      
      const letter = active.id.split('-')[0];
      const uniqueId = `${letter}-${Date.now()}`;
      
      if (over.id === 'dropzone') {
        // Add to end
        setPlacedTiles(prev => {
          const newTiles = [...prev, uniqueId];
          console.log('Added tile via drag:', uniqueId);
          return newTiles;
        });
      } else {
        // Add at specific position
        const position = parseInt(over.id.split('-')[1]);
        setPlacedTiles(prev => {
          const newTiles = [...prev];
          newTiles.splice(position, 0, uniqueId);
          console.log('Added tile at position:', position);
          return newTiles;
        });
      }
      playSound('place');
    } else if (over && placedTiles.includes(active.id) && placedTiles.includes(over.id)) {
      // Reorder within dropzone
      console.log('Reordering tiles');
      const oldIndex = placedTiles.indexOf(active.id);
      const newIndex = placedTiles.indexOf(over.id);
      
      if (oldIndex !== newIndex) {
        setPlacedTiles(prev => arrayMove(prev, oldIndex, newIndex));
        playSound('place');
      }
    }
  };

  const handleRemoveTile = (index) => {
    setPlacedTiles(prev => prev.filter((_, i) => i !== index));
    playSound('remove');
  };

  const handleSpeakWord = () => {
    if (placedTiles.length === 0) return;
    
    // Extract just the letters from the tile IDs to form the word
    const word = placedTiles.map(id => id.split('-')[0]).join('').toLowerCase();
    
    if (WORD_EMOJIS[word]) {
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
  };

  const handleClearAll = () => {
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
      onDragStart={(event) => console.log('Drag Start:', event)}
      onDragMove={(event) => console.log('Drag Move:', event)}
      collisionDetection={closestCenter}
    >
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
          Phonics Playground
        </h1>
        
        <div style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem' // Reduced gap for mobile
        }}>
          <DropZone 
            placedTiles={placedTiles} 
            onRemoveTile={handleRemoveTile}
          />
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.8rem', // Reduced gap for mobile
            flexWrap: 'wrap', // Allow buttons to wrap on very small screens
            padding: '0 10px' // Add padding for touch targets
          }}>
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
            onDragEnd={handleDragEnd}
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

// Update AlphabetTileGrid to remove tileCounts
function AlphabetTileGrid({ alphabet, onDragEnd }) {
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
        <LetterStack 
          key={letter}
          letter={letter}
          isSmallScreen={isSmallScreen}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
}

// Update LetterStack to remove count-related logic
function LetterStack({ letter, isSmallScreen, onDragEnd }) {
  return (
    <div style={{
      position: 'relative',
      height: isSmallScreen ? '65px' : '80px',
      width: isSmallScreen ? '60px' : '70px',
    }}>
      <StackedTile 
        letter={letter.toUpperCase()}
        style={{
          width: isSmallScreen ? '60px' : '70px',
          height: isSmallScreen ? '60px' : '70px',
        }}
        isSmallScreen={isSmallScreen}
        onDragEnd={onDragEnd}
      />
    </div>
  );
}

// Update StackedTile for responsive sizing
function StackedTile({ letter, style, isSmallScreen, onDragEnd }) {
  // Generate a unique ID for this instance
  const id = `${letter.toLowerCase()}-source`;
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const tileStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleClick = (e) => {
    // Only handle actual clicks, not drag events
    if (e.type === 'click') {
      const uniqueId = `${letter.toLowerCase()}-${Date.now()}`;
      console.log('Click handler called for', letter, 'with ID:', uniqueId);
      onDragEnd({
        active: { id: uniqueId },
        over: { id: 'dropzone' }
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        ...tileStyle,
        width: isSmallScreen ? '60px' : '70px',
        height: isSmallScreen ? '60px' : '70px',
        backgroundColor: isDragging ? '#B8E6B3' : '#A8D5E5',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isSmallScreen ? '2rem' : '2.5rem',
        fontWeight: 'bold',
        color: '#333333',
        cursor: 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'none',
        transition: isDragging ? 'none' : 'background-color 0.2s, box-shadow 0.2s',
        boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 0 rgba(0,0,0,0.1)',
        border: '3px solid rgba(255,255,255,0.5)',
        position: 'relative',
        zIndex: isDragging ? 1000 : 1,
      }}
      onClick={handleClick}
      {...listeners}
      {...attributes}
    >
      {letter}
    </div>
  );
}

// Update DropZone for better mobile experience
function DropZone({ placedTiles, onRemoveTile }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'dropzone',
  });
  
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
    <div 
      ref={setNodeRef} 
      style={{
        minHeight: '100px',
        backgroundColor: 'white',
        border: `4px dashed ${isOver ? '#45B7B8' : '#FFE66D'}`,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        padding: isSmallScreen ? '1rem' : '1.5rem',
        gap: '0.25rem',
        transition: 'border-color 0.3s ease',
        position: 'relative',
        flexWrap: 'wrap',
      }}
      role="region" 
      aria-label="Letter tiles drop zone"
    >
      <SortableContext items={placedTiles} strategy={horizontalListSortingStrategy}>
        {placedTiles.map((tileId, index) => (
          <React.Fragment key={`fragment-${tileId}-${index}`}>
            {index === 0 && <DropPositionIndicator index={0} isSmallScreen={isSmallScreen} />}
            
            <SortableTile 
              key={`${tileId}-${index}`}
              id={tileId}
              letter={tileId.split('-')[0].toUpperCase()}
              index={index}
              onRemoveTile={onRemoveTile}
              isSmallScreen={isSmallScreen}
            />
            
            <DropPositionIndicator index={index + 1} isSmallScreen={isSmallScreen} />
          </React.Fragment>
        ))}
        
        {placedTiles.length === 0 && <DropPositionIndicator index={0} isSmallScreen={isSmallScreen} />}
      </SortableContext>
    </div>
  );
}

function DropPositionIndicator({ index, isSmallScreen }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `position-${index}`,
  });
  
  return (
    <div
      ref={setNodeRef}
      style={{
        width: '8px',
        height: isSmallScreen ? '60px' : '70px',
        backgroundColor: isOver ? 'rgba(69, 183, 184, 0.5)' : 'transparent',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
        margin: '0 2px',
      }}
    />
  );
}

// Update SortableTile for responsive sizing
function SortableTile({ id, letter, index, onRemoveTile, isSmallScreen }) {
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
    width: isSmallScreen ? '60px' : '70px',
    height: isSmallScreen ? '60px' : '70px',
    backgroundColor: isDragging ? '#B8E6B3' : '#D7C0E0',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isSmallScreen ? '2rem' : '2.5rem', // Smaller font on mobile
    fontWeight: 'bold',
    color: '#333333',
    cursor: 'grab',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    touchAction: 'manipulation',
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