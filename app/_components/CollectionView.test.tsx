import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CollectionView from './CollectionView';

describe('Given the CollectionView component', () => {
  describe('When the items array is empty', () => {
    it('Then it displays a fallback explanation', () => {
      render(
        <CollectionView 
          items={[]} 
          view="grid"
          renderCard={() => <div />}
          renderTableRow={() => <div />}
          tableHeaders={<tr />}
        />
      );

      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('There are currently no items in this collection or matching your search filters.')).toBeInTheDocument();
    });
  });

  describe('When there are items to render', () => {
    it('Then it renders correctly as grid', () => {
      render(
        <CollectionView 
          items={['Item 1']} 
          view="grid"
          renderCard={(item) => <div key={item} data-testid="card">{item}</div>}
          renderTableRow={() => <div />}
          tableHeaders={<tr />}
        />
      );

      expect(screen.getByTestId('card')).toHaveTextContent('Item 1');
      expect(screen.queryByText('No items found')).not.toBeInTheDocument();
    });
  });
});
