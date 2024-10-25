'use client';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/ItemsPage.module.css';
import { useTheme } from '@/context/ThemeContext';
import { toTitleCase } from '@/utility/utilityFunctions';

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

  const renderValue = (subKey: string, subValue: any, typeProperties: any) => {
    const typeInfo = typeProperties[subKey];

    if (typeInfo.type === 'string' || typeInfo.type === 'integer') {
      return <p>{subValue}</p>;
    }

    if (typeInfo.type === 'object') {
      return (
        <ul>
          {Object.entries(typeInfo.properties).map(([dataKey, dataValue]) => {
            console.log('datakey', dataValue.type)
            if (dataValue.type === 'array') {
              return (
                <li key={dataKey}>
                  <strong>{toTitleCase(dataKey.replace(/_/g, ' '))}:</strong>
                  <ul>
                    {subValue[dataKey].map((ele: any, index: number) => (
                      <li key={index}>
                        {typeof ele === 'object' ? (
                          <ul>
                            {Object.entries(ele).map(([itemKey, itemValue]) => (
                              <li key={itemKey}>
                                <strong>{toTitleCase(itemKey.replace(/_/g, ' '))}:</strong> {itemValue}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          ele
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            } else 
            {
              return (
                <li key={dataKey}>
                  <strong>{toTitleCase(dataKey.replace(/_/g, ' '))}:</strong> {subValue[dataKey]}
                </li>
              )              
            }            
          })}
        </ul>
      );
    }

    if (typeInfo.type === 'array') {

      console.log('subkey', subKey, 'subValue:', subValue, 'typeProperties', typeProperties)
      return (
        <ul>
          {subValue.map((item: any, index: number) => {
            if (typeInfo.items.type === 'object') {
              return (
                <li key={index}>
                  <ul>
                    {Object.keys(typeInfo.items.properties).map((itemKey) => (
                      <li key={itemKey}>
                        <strong>{toTitleCase(itemKey.replace(/_/g, ' '))}:</strong> {item[itemKey]}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }
            return <li key={index}>{item}</li>;
          })}
        </ul>
      );
    }

    return null; // Fallback for unsupported types
  };

  return (
    <div className={`${styles.container} ${theme}`}>
      <button onClick={toggleTheme} className={styles.toggleButton}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <h1 className={styles.title}>Items</h1>
      <div className={styles.cardContainer}>
        {items.map((item) => {
          const value = JSON.parse(item.value);
          const typeProperties = JSON.parse(item.type).properties;

          return (
            <div key={item._id} className={styles.card}>
              <h2 className={styles.cardTitle}>{toTitleCase(item.key.replace(/_/g, ' '))}</h2>
              <p><strong>Created:</strong> {new Date(item.created).toLocaleString()}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <div className={styles.valueContainer}>
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} className={styles.subKey}>
                    <strong>{toTitleCase(subKey.replace(/_/g, ' '))}:</strong>
                    {renderValue(subKey, subValue, typeProperties)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemsPage;
