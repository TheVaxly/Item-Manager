import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddItem from './components/AddItem';
import ItemList from './components/ItemList';
import Favorites from './components/Favorites';
import EditItem from './components/EditItem';

const App = () => (
    <Router>
        <div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/add-item">Add Item</Link></li>
                    <li><Link to="/favorites">Favorites</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/" element={<ItemList />} />
                <Route path="/item-list" element={<ItemList />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/edit-item/:id" element={<EditItem />} />
                <Route path="/favorites" element={<Favorites />} />
            </Routes>
        </div>
    </Router>
);

export default App;
