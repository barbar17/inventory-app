'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import InventoryForm from '../../components/InventoryForm';
import InventoryList from '../../components/InventoryList';
import { Barang } from '../../types/Barang';
import { motion } from "motion/react";
import { Form } from 'react-bootstrap';

export default function Admin() {
  const { user, isChecking, setLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState<Barang | null>(null);
  const [tableFilter, setTableFilter] = useState<string>("")

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

  useEffect(() => {
    setLoading(false)
  }, [isChecking])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h1>Manajemen Inventaris</h1>
      <InventoryForm editingItem={editingItem} />
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mt-4">Inventory List</h2>
        <Form.Control
          style={{ maxWidth: '300px' }}
          type="text"
          name="nama"
          value={tableFilter}
          onChange={(e) => setTableFilter(e.target.value)}
          placeholder='Cari...'
        />
      </div>
      <InventoryList
        setGlobalFilter={setTableFilter}
        globalFilter={tableFilter}
        setEditingItem={setEditingItem}
        onDelete={handleDelete}
        readOnly={user?.role === 'user' && true}
      />
    </motion.div>
  );
}