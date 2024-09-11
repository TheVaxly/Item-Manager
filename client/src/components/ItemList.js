import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/items');
            const data = await response.json();
            setItems(data);
            setFilteredItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/items?favorite=true');
            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setFilteredItems(
            items.filter(item =>
                item.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    };

    const toggleFavorite = async (item) => {
        const isFavorite = favorites.some(fav => fav._id === item._id);

        // Optimistic UI update
        const updatedItems = items.map(i => 
            i._id === item._id ? { ...i, isFavorite: !isFavorite } : i
        );
        setItems(updatedItems);

        try {
            if (isFavorite) {
                // Remove from favorites
                await fetch(`http://localhost:5000/api/items/${item._id}/favorite`, { method: 'DELETE' });
            } else {
                // Add to favorites
                await fetch(`http://localhost:5000/api/items/${item._id}/favorite`, { method: 'PATCH' });
            }
            
            // Refresh the favorites list after updating
            fetchFavorites();
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Rollback optimistic update if there's an error
            setItems(items);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchFavorites();
    }, []);

    return (
        <div>
            <h1>Item List</h1>
            <input
                type="text"
                placeholder="Search items"
                value={searchTerm}
                onChange={handleSearch}
            />
            <ul>
                {filteredItems.map(item => {
                    const isFavorite = favorites.some(fav => fav._id === item._id);
                    return (
                        <li key={item._id}>
                            {item.name}: {item.description}
                            <button onClick={() => toggleFavorite(item)}>
                                {isFavorite ? '⭐' : '☆'}
                            </button>
                            <Link to={`/edit-item/${item._id}`}>Edit</Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ItemList;
