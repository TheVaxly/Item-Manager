import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import Favorites from '../components/Favorites';

describe('Favorites Component', () => {
  test('renders Favorites list', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: '1', name: 'Favorite Item' }]),
      })
    );

    render(<Favorites />);
    expect(await screen.findByText('Favorite Item')).toBeInTheDocument();
  });

  test('should remove favorite item from the list', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: '1', name: 'Favorite Item' }]),
      })
    );

    render(<Favorites />);
    const removeButton = await screen.findByText('Remove');
    fireEvent.click(removeButton);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('favorite'), { method: 'DELETE' });
  });
});
