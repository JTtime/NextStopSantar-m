'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/ItemsPage.module.css'; 
import { useTheme } from '../context/ThemeContext';

interface Item {
  _id: string;
  created: string;
  failure_reason: string | null;
  id: string;
  key: string;
  modified: string;
  status: string;
  type: string; 
  value: string;
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={`${styles.container} ${theme}`}>
      <button onClick={toggleTheme} className={styles.toggleButton}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <h1 className={styles.title}>Items</h1>
      <ul className={styles.itemList}>
        {items.map((item) => (
          <li key={item._id} className={styles.item}>
            <h2 className={styles.itemKey}>{item.key}</h2>
            <p><strong>Created:</strong> {new Date(item.created).toLocaleString()}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Value:</strong> {JSON.parse(item.value).luggage_lockers?.Santarém_Airport || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsPage;
