import React from 'react';
import { DndContext } from '@dnd-kit/core';
import styled from 'styled-components';
import TileGrid from './components/TileGrid';
import DropZone from './components/DropZone';
import { useState } from 'react';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-color: #FFF9E6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const GameArea = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

function App() {
  const [placedTiles, setPlacedTiles] = useState([]);
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over?.id === 'dropzone' && active?.id) {
      // Prevent duplicates
      if (!placedTiles.includes(active.id)) {
        setPlacedTiles(prev => [...prev, active.id]);
      }
    }
  };

  const handleRemoveTile = (index) => {
    setPlacedTiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <AppContainer>
        <GameArea>
          <DropZone 
            placedTiles={placedTiles} 
            onRemoveTile={handleRemoveTile}
          />
          <TileGrid placedTiles={placedTiles} />
        </GameArea>
      </AppContainer>
    </DndContext>
  );
}

export default App; 