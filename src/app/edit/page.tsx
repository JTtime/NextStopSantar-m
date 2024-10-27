'use client'
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from '@/styles/ItemsPage.module.css';

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
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [updatedData, setUpdatedData] = useState<{ [key: string]: string }>({});
  const { theme } = useTheme();

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setUpdatedData(JSON.parse(item.value));
  };

  const handleInputChange = (key: string, value: string) => {
    setUpdatedData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/edit/${editingItem._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedData }),
      });
      const updatedItem = await response.json();
      setItems((prevItems) =>
        prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
      setEditingItem(null); // Close the edit mode
    } catch (error) {
      console.error('Failed to save changes', error);
    }
  };

  return (
    <div className={`${styles.container} ${theme}`}>
      <h1 className={styles.title}>Listing Details</h1>
      <div className={styles.cardContainer}>
        {items.map((item) => (
          <div key={item._id} className={styles.card}>
            <h2 className={styles.cardTitle}>{item.key}</h2>
            <p><strong>Status:</strong> {item.status}</p>

            {editingItem?._id === item._id ? (
              <div>
                {Object.keys(updatedData).map((key) => (
                  <input
                    key={key}
                    type="text"
                    value={updatedData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                ))}
                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              <button onClick={() => handleEditClick(item)}>Edit</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;
