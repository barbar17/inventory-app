'user client';
import { Dispatch, SetStateAction, useState, useMemo, useEffect } from 'react';
import { Barang } from '../types/Barang';
import { Table, ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import { Button } from 'react-bootstrap';
import DefaultTable from './DefaultTable';
import { PrintTable } from '@/app/components/PrintTable';
import { ExportToXlsx } from '@/app/components/ExportToXlsx';
import { toast } from 'react-toastify';

const defaultSort: SortingState = [{ id: 'no', desc: false },]

const InventoryList = ({ handleEditItem, onDelete, readOnly = false, getBarang, barang, tableLoading }: {
  handleEditItem?: (barang: Barang) => void,
  onDelete?: (id: string, nama: string) => void,
  readOnly?: boolean,
  getBarang: () => Promise<void>,
  barang: Barang[],
  tableLoading: boolean,
}) => {
  const [tableComponent, setTableComponent] = useState<Table<Barang> | null>(null);

  useEffect(() => {
    getBarang()
  }, [])

  const columns = useMemo<ColumnDef<Barang>[]>(() => {
    return [
      { accessorKey: 'no', header: 'No', size: 70 },
      { accessorKey: 'nama', header: 'Barang' },
      { accessorKey: 'jenis', header: 'Jenis', size: 100 },
      { accessorKey: 'qty', header: 'Jumlah', size: 110 },
      { accessorKey: 'tahun_pengadaan', header: 'Thn Pengadaan', size: 170 },
      { accessorKey: 'kondisi', header: 'Kondisi' },
      { accessorKey: 'lokasi', header: 'Lokasi' },
      {
        accessorKey: 'status_op', header: 'Status Op', size: 120, cell: ({ getValue }) => {
          const value = getValue() as boolean; return value ? "Ya" : "Tidak"
        },
        meta: {
          print: (value) => Boolean(value) ? "Ya" : "Tidak",
        }
      },
      { accessorKey: 'ket', header: 'Ket' },
      { accessorKey: 'ip', header: 'IP Address' },
      { accessorKey: 'mac', header: 'Mac Address' },
      ...(!readOnly ? [
        { accessorKey: 'created_by', header: 'User Input', size: 130 },
        {
          accessorKey: 'created_at', header: 'Tgl Input', size: 130, cell: ({ getValue }: { getValue: any }) => {
            const value = getValue() as string; return value?.slice(0, 10)
          },
          meta: {
            print: (value: any) => String(value).slice(0, 10),
          }
        },
        {
          id: 'aksi', header: 'Aksi', cell: ({ row }: { row: any }) => (
            <>
              <Button variant="warning" size="sm" onClick={() => handleEditItem!(row.original)} className="me-2">Edit</Button>
              <Button variant="danger" size="sm" onClick={() => onDelete!(row.original.id, row.original.nama)}>Delete</Button>
            </>
          )
        },
      ] : [])
    ]
  }, [readOnly, barang]);

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
    <>
      <div className="d-flex justify-content-between align-items-center mb-2 pt-2">
        <div className="d-flex gap-2">
          <Button type="button" variant="danger" onClick={() => handleExport('pdf')}>
            <i className="bi bi-file-earmark-pdf-fill"></i><span style={{ marginLeft: "4px" }}>Export PDF</span>
          </Button>
          <Button type="button" variant="success" onClick={() => handleExport('excel')}>
            <i className="bi bi-file-earmark-excel-fill"></i><span style={{ marginLeft: "4px" }}>Export Excel</span>
          </Button>
        </div>
      </div>
      <DefaultTable<Barang>
        loading={tableLoading}
        tableWidth="120%"
        data={barang}
        columns={columns}
        defaultSort={defaultSort}
        setTableComponent={setTableComponent}
      />
    </>
  );
};

export default InventoryList;