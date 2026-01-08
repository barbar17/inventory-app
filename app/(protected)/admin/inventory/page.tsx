'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/components/AuthProvider';
import { useRouter } from 'next/navigation';
import InventoryForm from '@/app/components/InventoryForm';
import InventoryList from '@/app/components/InventoryList';
import { Barang, BarangForm } from '@/app/types/Barang';
import { motion } from "motion/react";
import { Form, Button } from 'react-bootstrap';
import { Table } from '@tanstack/react-table';
import { PrintTable } from '@/app/components/PrintTable';
import { ExportToXlsx } from '@/app/components/ExportToXlsx';
import ConfirmModal from '@/app/components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminInventory() {
  const { user, setLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState<Barang | null>(null);
  const [tableFilter, setTableFilter] = useState<string>("")
  const [tableComponent, setTableComponent] = useState<Table<Barang> | null>(null);
  const [barang, setBarang] = useState<Barang[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteBarang, setDeleteBarang] = useState<{ id: string, nama: string } | null>(null);

  const onDelete = (id: string, nama: string) => {
    setDeleteBarang({ id, nama })
    setShowConfirm(true);
  }

  const onConfirmDelete = async () => {
    if (!deleteBarang) toast.error("Barang tidak ditemukan");
    if (!deleteBarang?.id) toast.error("ID barang tidak boleh kosong");
    setLoading(true);

    try {
      const res = await fetch(`/api/barang/${deleteBarang?.id}`, {method: 'DELETE'})
      const payload = await res.json();
      if (!res.ok) {
        toast.error(payload.error);
        return;
      }

      toast.success(`Berhasil hapus ${deleteBarang?.nama}`);
      getBarang();
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
      setDeleteBarang(null);
    }

    setShowConfirm(false);
  }

  const handleExport = (tipe: string) => {
    if (!tableComponent) {
      toast.error("table tidak ditemukan");
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
        toast.error(payload.error)
        return
      }

      setBarang(payload)
    } catch (error: any) {
      toast.error(error)
    } finally {
      setLoading(false)
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
        setEditingItem={setEditingItem}
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
        handleEditItem={setEditingItem}
        onDelete={onDelete}
        readOnly={user?.role === 'user' && true}
        setTableComponent={setTableComponent}
        getBarang={getBarang}
        barang={barang}
      />
      <ConfirmModal
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        item={deleteBarang}
        handleConfirm={onConfirmDelete}
      />
    </motion.div>
  );
}