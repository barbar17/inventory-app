'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Button, Container, Modal } from 'react-bootstrap';
import InventoryForm from '../../components/InventoryForm';
import InventoryList from '../../components/InventoryList';
import Layout from '../../components/Layout';

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const storedItems = localStorage.getItem('inventory');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, [user, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      localStorage.setItem('inventory', JSON.stringify(items));
    }
  }, [items, user]);

  const handleSave = (item) => {
    if (editingItem) {
      setItems(items.map((i) => (i.id === item.id ? item : i)));
      setEditingItem(null);
    } else {
      setItems([...items, item]);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <Layout>
      <h1>Manajemen Inventaris</h1>
      <InventoryForm onSave={handleSave} editingItem={editingItem} />
      <h2 className="mt-4">Inventory List</h2>
      <InventoryList
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Layout>
  );
}