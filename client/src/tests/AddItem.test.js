import { render, screen, fireEvent } from '@testing-library/react';
import AddItem from '../components/AddItem';
import '@testing-library/jest-dom'

describe('AddItem Component', () => {
    test('renders the AddItem form', () => {
        render(<AddItem />);
        expect(screen.getByText(/Add New Item/i)).toBeInTheDocument();
    });

    test('should update name and description fields', () => {
        render(<AddItem />);
        const nameInput = screen.getByPlaceholderText('Item name');
        const descriptionInput = screen.getByPlaceholderText('Item description');

        fireEvent.change(nameInput, { target: { value: 'Test Name' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

        expect(nameInput.value).toBe('Test Name');
        expect(descriptionInput.value).toBe('Test Description');
    });

    test('should show success message after adding item', async () => {
        render(<AddItem />);
        const nameInput = screen.getByPlaceholderText('Item name');
        const descriptionInput = screen.getByPlaceholderText('Item description');
        const submitButton = screen.getByText(/Add Item/i);

        fireEvent.change(nameInput, { target: { value: 'New Item' } });
        fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Item added successfully!/i)).toBeInTheDocument();
    });

    test('should show error message on failed submission', async () => {
        // Mock fetch to simulate failed API call
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Something went wrong' }),
            })
        );

        render(<AddItem />);
        const nameInput = screen.getByPlaceholderText('Item name');
        const descriptionInput = screen.getByPlaceholderText('Item description');
        const submitButton = screen.getByText(/Add Item/i);

        fireEvent.change(nameInput, { target: { value: 'New Item' } });
        fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
    });
});
