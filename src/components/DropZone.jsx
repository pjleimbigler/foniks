import React from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';

const Zone = styled.div`
  min-height: 100px;
  background-color: white;
  border: 2px dashed ${props => props.$isOver ? '#45B7B8' : '#ccc'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
`;

const PlacedTile = styled.div`
  width: 70px;
  height: 70px;
  background-color: #D7C0E0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: #333333;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #E8B0B0;
    transform: scale(0.95);
  }
`;

function DropZone({ placedTiles, onRemoveTile }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'dropzone',
  });

  return (
    <Zone ref={setNodeRef} $isOver={isOver} role="region" aria-label="Letter tiles drop zone">
      {placedTiles.map((tileId, index) => (
        <PlacedTile 
          key={`${tileId}-${index}`}
          onClick={() => onRemoveTile(index)}
          role="button"
          aria-label={`Remove ${tileId.toUpperCase()} tile`}
        >
          {tileId.toUpperCase()}
        </PlacedTile>
      ))}
    </Zone>
  );
}

export default DropZone; 