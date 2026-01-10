'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/components/AuthProvider';
import InventoryForm from '@/app/components/InventoryForm';
import InventoryList from '@/app/components/InventoryList';
import { Barang } from '@/app/types/Barang';
import { motion } from "motion/react";
import ConfirmModal from '@/app/components/ConfirmModal';
import { toast } from 'react-toastify';

export default function AdminInventory() {
  const { user, setLoading } = useAuth();
  const [editingItem, setEditingItem] = useState<Barang | null>(null);
  const [barang, setBarang] = useState<Barang[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteBarang, setDeleteBarang] = useState<{ id: string, nama: string } | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const onDelete = (id: string, nama: string) => {
    setDeleteBarang({ id, nama })
    setShowConfirm(true);
  }

  const onConfirmDelete = async () => {
    if (!deleteBarang) toast.error("Barang tidak ditemukan");
    if (!deleteBarang?.id) toast.error("ID barang tidak boleh kosong");
    setLoading(true);

    try {
      const res = await fetch(`/api/barang/${deleteBarang?.id}`, { method: 'DELETE' })
      const payload = await res.json();
      if (!res.ok) {
        toast.error(payload.error);
        return;
      }

      toast.success(`Berhasil hapus ${deleteBarang?.nama}`);
      getBarang();
    } catch (error) {
      toast.error(String(error));
      setLoading(false);
    } finally {
      setDeleteBarang(null);
      setShowConfirm(false);
      setLoading(false);
    }
  }

  const getBarang = async () => {
    setTableLoading(true);
    try {
      const res = await fetch("/api/barang", { credentials: "include" });
      const payload = await res.json()

      if (!res.ok) {
        toast.error(payload.error.message ?? payload.error)
        return
      }

      setBarang(payload)
    } catch (error: any) {
      toast.error(String(error))
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [])

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
      <InventoryList
        tableLoading={tableLoading}
        handleEditItem={setEditingItem}
        onDelete={onDelete}
        readOnly={user?.role === 'user' && true}
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