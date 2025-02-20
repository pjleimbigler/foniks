import React from 'react';
import styled from 'styled-components';
import Tile from './Tile';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const initialTiles = [
  { id: 'c', letter: 'C' },
  { id: 'a', letter: 'A' },
  { id: 't', letter: 'T' },
  { id: 'd', letter: 'D' },
  { id: 'o', letter: 'O' },
  { id: 'g', letter: 'G' },
];

function TileGrid({ placedTiles }) {
  return (
    <Grid>
      {initialTiles
        .filter(tile => !placedTiles.includes(tile.id))
        .map(tile => (
          <Tile 
            key={tile.id} 
            id={tile.id}
            letter={tile.letter}
          />
        ))}
    </Grid>
  );
}

export default TileGrid; 