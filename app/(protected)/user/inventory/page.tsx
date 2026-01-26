'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/components/AuthProvider';
import InventoryList from '@/app/components/InventoryList';
import { Barang } from '@/app/types/Barang';
import { motion } from "motion/react";
import { toast } from 'react-toastify';

export default function UserInventory() {
  const { user, setLoading } = useAuth();
  const [barang, setBarang] = useState<Barang[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const getBarang = async () => {
    setTableLoading(true)
    try {
      const res = await fetch("/api/barang", { credentials: "include" });
      const payload = await res.json()

      if (!res.ok) {
        toast.error(payload.error.message ?? payload.error)
        return
      }

      setBarang(payload)
    } catch (error: any) {
      toast.error(error)
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
      <h1>Inventaris</h1>
      <InventoryList
        tableLoading={tableLoading}
        readOnly={user?.role === 'user' && true}
        getBarang={getBarang}
        barang={barang}
      />
    </motion.div>
  );
}