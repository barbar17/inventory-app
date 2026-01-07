'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/components/AuthProvider';
import { useRouter } from 'next/navigation';
import InventoryForm from '@/app/components/InventoryForm';
import InventoryList from '@/app/components/InventoryList';
import { Barang } from '@/app/types/Barang';
import { motion } from "motion/react";
import { Form, Button } from 'react-bootstrap';
import { Table } from '@tanstack/react-table';
import { PrintTable } from '@/app/components/PrintTable';
import { ExportToXlsx } from '@/app/components/ExportToXlsx';

export default function AdminInventory() {
  const { user, isChecking, setLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState<Barang | null>(null);
  const [tableFilter, setTableFilter] = useState<string>("")
  const [tableComponent, setTableComponent] = useState<Table<Barang> | null>(null);
  const [barang, setBarang] = useState<Barang[]>([]);

  const handleDelete = (id: string) => {
    console.log(id)
  }

  const handleExport = (tipe: string) => {
    if (!tableComponent) {
      alert("table tidak ditemukan");
      return;
    }

    if (tipe === 'pdf') {
      PrintTable(tableComponent, { title: 'Inventaris' });
    } else if (tipe === 'excel') {
      ExportToXlsx(tableComponent, 'Inventaris');
    }
  }

  async function getBarang() {
    try {
      const res = await fetch("/api/barang", { credentials: "include" });
      const payload = await res.json()

      if (!res.ok) {
        alert(payload.error)
        return
      }

      setBarang(payload)
    } catch (error) {
      alert(error)
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
      <h1>Manajemen Inventaris</h1>
      <InventoryForm
        editingItem={editingItem}
        getBarang={getBarang}
      />

      <h2 className="mt-4">Inventory List</h2>
      <div className="d-flex justify-content-between align-items-center mb-2 pt-2">
        <div className="d-flex gap-2">
          <Button type="button" variant="danger" onClick={() => handleExport('pdf')}>
            <i className="bi bi-file-earmark-pdf-fill"></i><span style={{ marginLeft: "4px" }}>Export PDF</span>
          </Button>
          <Button type="button" variant="success" onClick={() => handleExport('excel')}>
            <i className="bi bi-file-earmark-excel-fill"></i><span style={{ marginLeft: "4px" }}>Export Excel</span>
          </Button>
        </div>
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
        setTableComponent={setTableComponent}
        getBarang={getBarang}
        barang={barang}
      />
    </motion.div>
  );
}