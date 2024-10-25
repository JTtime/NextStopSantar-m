'use client'
import React, { useEffect, useState } from 'react';

interface Item {
  _id: string;
  created: string;
  failure_reason: string | null;
  id: string;
  key: string;
  modified: string;
  status: string;
  type: string; // You may want to parse this further depending on your needs
  value: string; // This will also need parsing
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h2>{item.key}</h2>
            <p><strong>Created:</strong> {new Date(item.created).toLocaleString()}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Value:</strong> {JSON.parse(item.value).luggage_lockers?.Santarém_Airport || 'N/A'}</p>
            {/* You can expand this part to display more details based on your needs */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsPage;
