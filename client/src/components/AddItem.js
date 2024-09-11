import React, { useState } from 'react';

const AddItem = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });
            const result = await response.json();
            if (response.ok) {
                setSuccess(true);
                setName('');
                setDescription('');
                setError(null);
            } else {
                throw new Error(result.message || 'Something went wrong');
            }
        } catch (error) {
            setError(error.message);
            setSuccess(false);
        }
    };

    return (
        <div>
            <h1>Add New Item</h1>
            {success && <p>Item added successfully!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Item name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Item description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
};

export default AddItem;
