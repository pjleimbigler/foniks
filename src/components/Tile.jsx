import React from 'react';
import styled from 'styled-components';
import { useDraggable } from '@dnd-kit/core';

const TileContainer = styled.div`
  width: 70px;
  height: 70px;
  background-color: ${props => props.$isDragging ? '#B8E6B3' : '#A8D5E5'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: #333333;
  cursor: grab;
  user-select: none;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

function Tile({ id, letter }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <TileContainer
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      {...listeners}
      {...attributes}
    >
      {letter}
    </TileContainer>
  );
}

export default Tile; 