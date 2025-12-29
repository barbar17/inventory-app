'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import InventoryForm from '../../components/InventoryForm';
import InventoryList from '../../components/InventoryList';
import Layout from '../../components/Layout';
import { Barang } from '../../types/Barang';

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState<Barang | null>(null);

  const handleDelete = (id: string) => {
    console.log(id)
  }

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

  return (
    <Layout>
      <h1>Manajemen Inventaris</h1>
      <InventoryForm editingItem={editingItem} />
      <h2 className="mt-4">Inventory List</h2>
      <InventoryList
        setEditingItem={setEditingItem}
        onDelete={handleDelete}
        readOnly={user?.role === 'user' && true}
      />
    </Layout>
  );
}