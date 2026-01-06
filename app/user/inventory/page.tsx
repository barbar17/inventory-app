'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import InventoryList from '../../components/InventoryList';
import { Barang } from '../../types/Barang';
import { motion } from "motion/react";
import { Form, Button } from 'react-bootstrap';
import { PrintTable } from '@/app/components/PrintTable';
import { Table } from '@tanstack/react-table';

export default function UserInventory() {
  const { user, isChecking, setLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState<Barang | null>(null);
  const [tableFilter, setTableFilter] = useState<string>("")
  const [tableComponent, setTableComponent] = useState<Table<Barang> | null>(null);

  const handleDelete = (id: string) => {
    console.log(id)
  }

  const handlePrint = () => {
    if (tableComponent) {
      PrintTable(tableComponent, { title: 'Inventaris' });
    } else {
      alert("table tidak ditemukan");
    }
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
      <h1>Inventaris</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button type="button" variant="danger" onClick={handlePrint}>
          Export PDF
        </Button>
        <Form.Control
          style={{ maxWidth: '300px' }}
          type="text"
          name="nama"
          value={tableFilter}
          onChange={(e) => setTableFilter(e.target.value)}
          placeholder='Cari...'
        />
      </div>
      <div className='print-area'>
        <InventoryList
          setGlobalFilter={setTableFilter}
          globalFilter={tableFilter}
          setEditingItem={setEditingItem}
          onDelete={handleDelete}
          readOnly={user?.role === 'user' && true}
          setTableComponent={setTableComponent}
        />
      </div>
    </motion.div>
  );
}