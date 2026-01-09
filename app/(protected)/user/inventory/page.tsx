'use client';

import { useState } from 'react';
import { useAuth } from '@/app/components/AuthProvider';
import InventoryList from '@/app/components/InventoryList';
import { Barang } from '@/app/types/Barang';
import { motion } from "motion/react";
import { Form, Button } from 'react-bootstrap';
import { PrintTable } from '@/app/components/PrintTable';
import { Table } from '@tanstack/react-table';
import { ExportToXlsx } from '@/app/components/ExportToXlsx';
import { toast } from 'react-toastify';

export default function UserInventory() {
  const { user, setLoading } = useAuth();
  const [tableFilter, setTableFilter] = useState<string>("")
  const [tableComponent, setTableComponent] = useState<Table<Barang> | null>(null);
  const [barang, setBarang] = useState<Barang[]>([]);

  const getBarang = async() => {
    setLoading(true)
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h1>Inventaris</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <Button type="button" variant="danger" onClick={() => handleExport('pdf')}>
            <i className="bi bi-file-earmark-pdf-fill"></i><span style={{marginLeft: "4px"}}>Export PDF</span>
          </Button>
          <Button type="button" variant="success" onClick={() => handleExport('excel')}>
            <i className="bi bi-file-earmark-excel-fill"></i><span style={{marginLeft: "4px"}}>Export Excel</span>
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
      <div className='print-area'>
        <InventoryList
          setGlobalFilter={setTableFilter}
          globalFilter={tableFilter}
          readOnly={user?.role === 'user' && true}
          setTableComponent={setTableComponent}
          barang={barang}
          getBarang={getBarang}
        />
      </div>
    </motion.div>
  );
}