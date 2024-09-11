import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import EditItem from '../components/EditItem';
import { BrowserRouter } from 'react-router-dom';

describe('EditItem Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'Test Item', description: 'Test Description' }),
      })
    );
  });

  test('renders EditItem form', async () => {
    render(
      <BrowserRouter>
        <EditItem />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Item')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });
  });

  test('should update name and description fields', async () => {
    render(
      <BrowserRouter>
        <EditItem />
      </BrowserRouter>
    );

    const nameInput = await screen.findByDisplayValue('Test Item');
    fireEvent.change(nameInput, { target: { value: 'Updated Item' } });
    expect(nameInput.value).toBe('Updated Item');
  });
});
