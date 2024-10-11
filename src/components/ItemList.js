import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const ItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Items for Sale</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.title} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;