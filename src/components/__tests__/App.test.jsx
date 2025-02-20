import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App';

// Mock @dnd-kit/core
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragEnd }) => {
    // Store the callback for our tests to use
    window.__dndHandler = onDragEnd;
    return <div>{children}</div>;
  },
  useDroppable: () => ({
    setNodeRef: () => {},
    isOver: false
  }),
  useDraggable: () => ({
    setNodeRef: () => {},
    listeners: {},
    attributes: {},
    transform: null,
    isDragging: false
  })
}));

describe('App', () => {
  it('removes tile from drop zone when clicked', async () => {
    render(<App />);
    
    // Simulate dropping the first tile
    await act(async () => {
      window.__dndHandler({
        active: { id: 'c' },
        over: { id: 'dropzone' }
      });
    });

    // Verify tile was added to drop zone
    const placedTile = screen.getAllByText('C')[0];
    expect(placedTile).toBeInTheDocument();

    // Click the placed tile to remove it
    await act(async () => {
      fireEvent.click(placedTile);
    });

    // Verify tile was removed from drop zone
    expect(screen.getAllByText('C').length).toBe(1); // Only exists in tile grid now
  });

  it('maintains correct tile order after removal', async () => {
    render(<App />);
    
    // Add all tiles to drop zone
    const tiles = ['c', 'a', 't'];
    
    // Add tiles one by one
    for (const tile of tiles) {
      await act(async () => {
        window.__dndHandler({
          active: { id: tile },
          over: { id: 'dropzone' }
        });
      });
    }

    // Log the state before removal
    const beforeRemoval = Array.from(screen.getByRole('region').querySelectorAll('[role="button"]'))
      .map(tile => tile.textContent);
    console.log('Tiles before removal:', beforeRemoval);

    // Remove middle tile
    const middleTile = screen.getAllByText('A')[0];
    await act(async () => {
      fireEvent.click(middleTile);
    });

    // Get only the tiles in the drop zone
    const dropZone = screen.getByRole('region');
    const remainingTiles = Array.from(dropZone.querySelectorAll('[role="button"]'))
      .map(tile => tile.textContent);
    
    console.log('Tiles after removal:', remainingTiles);

    // Verify remaining tiles are in correct order
    expect(remainingTiles).toEqual(['C', 'T']); // Exact order matters
  });
}); 