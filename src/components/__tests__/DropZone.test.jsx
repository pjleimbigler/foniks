import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DropZone from '../DropZone';
import { DndContext } from '@dnd-kit/core';

// Wrapper component to provide DND context
const TestWrapper = ({ children }) => (
  <DndContext>
    {children}
  </DndContext>
);

describe('DropZone', () => {
  it('renders empty drop zone when no tiles are placed', () => {
    render(
      <TestWrapper>
        <DropZone placedTiles={[]} onRemoveTile={() => {}} />
      </TestWrapper>
    );
    
    const dropZone = screen.getByRole('region');
    expect(dropZone).toBeInTheDocument();
    expect(dropZone.children.length).toBe(0);
  });

  it('renders placed tiles correctly', () => {
    const placedTiles = ['a', 'b', 'c'];
    
    render(
      <TestWrapper>
        <DropZone placedTiles={placedTiles} onRemoveTile={() => {}} />
      </TestWrapper>
    );

    placedTiles.forEach(tile => {
      expect(screen.getByText(tile.toUpperCase())).toBeInTheDocument();
    });
  });

  it('calls onRemoveTile with correct index when tile is clicked', () => {
    const mockRemove = vi.fn();
    const placedTiles = ['a', 'b', 'c'];
    
    render(
      <TestWrapper>
        <DropZone placedTiles={placedTiles} onRemoveTile={mockRemove} />
      </TestWrapper>
    );

    // Click the second tile (index 1)
    fireEvent.click(screen.getByText('B'));
    
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith(1);
  });
}); 