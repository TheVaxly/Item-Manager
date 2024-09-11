import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemList from '../components/ItemList';
import { BrowserRouter } from 'react-router-dom';

describe('ItemList Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('items?favorite=true')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { _id: '1', name: 'Item 1', description: 'Description 1', isFavorite: false },
            { _id: '2', name: 'Item 2', description: 'Description 2', isFavorite: false }
          ]),
        });
      } else if (url.includes('items')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { _id: '1', name: 'Item 1', description: 'Description 1', isFavorite: false },
            { _id: '2', name: 'Item 2', description: 'Description 2', isFavorite: false }
          ]),
        });
      } else if (url.includes('items/1/favorite')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ _id: '1', name: 'Item 1', isFavorite: true }),
        });
      } else if (url.includes('items/2/favorite')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ _id: '2', name: 'Item 2', isFavorite: true }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
  });

  test('renders items correctly', async () => {
    render(
      <BrowserRouter>
        <ItemList />
      </BrowserRouter>
    );

    await waitFor(() => {

      expect(screen.getByText('Item 1: Description 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2: Description 2')).toBeInTheDocument();
    });
  });

  test('search functionality filters items correctly', async () => {
    render(
      <BrowserRouter>
        <ItemList />
      </BrowserRouter>
    );

    expect(await screen.findByText('Item 1: Description 1')).toBeInTheDocument();
    expect(await screen.findByText('Item 2: Description 2')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Search items/i), { target: { value: 'Item 1' } });
    await waitFor(() => {
      expect(screen.getByText('Item 1: Description 1')).toBeInTheDocument();
      expect(screen.queryByText('Item 2: Description 2')).not.toBeInTheDocument();
    });
  });
});
