import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditItem = () => {
    const { id } = useParams(); // MongoDB _id
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/items/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setName(data.name);
                    setDescription(data.description);
                } else {
                    const errorText = await response.text();
                    console.error(`Failed to fetch item: ${response.status} ${response.statusText}`, errorText);
                }
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };

        fetchItem();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            if (response.ok) {
                navigate('/item-list');
            } else {
                const errorText = await response.text();
                console.error('Failed to update item:', errorText);
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/items/${id}`, { method: 'DELETE' });
            if (response.ok) {
                navigate('/item-list');
            } else {
                const errorText = await response.text();
                console.error('Failed to delete item:', errorText);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div>
            <h1>Edit Item</h1>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">Update</button>
            </form>
            <button onClick={handleDelete}>Delete Item</button>
        </div>
    );
};

export default EditItem;
