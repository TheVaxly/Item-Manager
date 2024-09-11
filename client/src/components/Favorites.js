import React, { useState, useEffect } from 'react';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/items?favorite=true');
            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const removeFavorite = async (id) => {
        try {
            // Send a request to remove the item from favorites
            const response = await fetch(`http://localhost:5000/api/items/${id}/favorite`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Remove item from the state after successful deletion
                setFavorites(favorites.filter(item => item._id !== id));
            } else {
                console.error('Failed to remove favorite:', await response.text());
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <div>
            <h1>Favorites</h1>
            <ul>
                {favorites.map(item => (
                    <li key={item._id}>
                        {item.name}
                        <button onClick={() => removeFavorite(item._id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Favorites;
