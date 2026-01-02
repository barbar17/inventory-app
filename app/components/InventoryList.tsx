import { Dispatch, SetStateAction, useState, useMemo, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Barang } from '../types/Barang';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { Button } from 'react-bootstrap';

const InventoryList = ({ setEditingItem, onDelete, setGlobalFilter, globalFilter, readOnly = false }: {
  setEditingItem: Dispatch<SetStateAction<Barang | null>>,
  setGlobalFilter: Dispatch<SetStateAction<string>>,
  onDelete: (id: string) => void,
  readOnly?: boolean,
  globalFilter: string,
}) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'nama', desc: false },]);
  const [barang, setBarang] = useState<Barang[]>([]);

  useEffect(() => {
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

    getBarang()
  }, [])

  useEffect(() => {
    console.log(barang)
  }, [barang])

  const columns = useMemo<ColumnDef<Barang>[]>(() => {
    return [
      { accessorKey: 'no', header: 'No' },
      { accessorKey: 'nama', header: 'Barang' },
      { accessorKey: 'jenis', header: 'Jenis' },
      { accessorKey: 'qty', header: 'Jumlah' },
      {
        accessorKey: 'tahun_pengadaan', header: 'Tgl Pengadaan', cell: ({ getValue }) => {
          const value = getValue() as string; return value?.slice(0, 10)
        }
      },
      { accessorKey: 'kondisi', header: 'Kondisi' },
      { accessorKey: 'lokasi', header: 'Lokasi' },
      { accessorKey: 'status_op', header: 'Status Op' , cell: ({ getValue }) => {
          const value = getValue() as boolean; return value ? "Ya" : "Tidak"
        }},
      { accessorKey: 'ket', header: 'Ket' },
      { accessorKey: 'ip', header: 'IP Address' },
      { accessorKey: 'mac', header: 'Mac Address' },
      { accessorKey: 'created_by', header: 'User' },
      {
        accessorKey: 'created_at', header: 'Tgl Input', cell: ({ getValue }) => {
          const value = getValue() as string; return value?.slice(0, 10)
        }
      },
      ...(!readOnly ? [
        {
          id: 'aksi', header: 'Aksi', cell: (row: any) => (
            <>
              <Button variant="warning" size="sm" onClick={() => console.log(row.original)} className="me-2">Edit</Button>
              <Button variant="danger" size="sm" onClick={() => console.log(row.original)}>Delete</Button>
            </>
          )
        },
      ] : [])
    ]
  }, [readOnly]);

  const table = useReactTable<Barang>({
    data: barang,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSortingRemoval: false,
  })

  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
        {table.getHeaderGroups().map(hg => (
          <tr key={hg.id}>
            {hg.headers.map(h => (
              <th key={h.id} onClick={h.column.getToggleSortingHandler()} style={{ cursor: h.column.getCanSort() ? 'pointer' : 'default' }}>
                <div className="d-flex align-items-center justify-content-between" style={{ userSelect: "none" }}>
                  {flexRender(h.column.columnDef.header, h.getContext())}

                  {h.column.getCanSort() && (
                    <span>
                      {h.column.getIsSorted() === 'asc' && '▲'}
                      {h.column.getIsSorted() === 'desc' && '▼'}
                      {!h.column.getIsSorted() && '⇅'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InventoryList;