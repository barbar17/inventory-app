import { Dispatch, SetStateAction, useState, useMemo } from 'react';
import { Table } from 'react-bootstrap';
import { Barang } from '../types/Barang';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { Button } from 'react-bootstrap';

const mock: Barang[] = [
  { id: '1', nama: 'Laptop Dell', jenis: 'IT Device', qty: 5, tahunPengadaan: '2021', kondisi: 'Bagus', lokasi: 'Ruang IT', statusOperasional: true, ket: 'Persediaan', ip: '123456', mac: '098765' },
  { id: '2', nama: 'Laptop Asus', jenis: 'IT Device', qty: 5, tahunPengadaan: '2021', kondisi: 'Bagus', lokasi: 'Ruang IT', statusOperasional: true, ket: 'Persediaan', ip: '123456', mac: '098765' },
  { id: '3', nama: 'Laptop Advan', jenis: 'IT Device', qty: 5, tahunPengadaan: '2021', kondisi: 'Bagus', lokasi: 'Ruang IT', statusOperasional: true, ket: 'Persediaan', ip: '123456', mac: '098765' },
]

const InventoryList = ({ setEditingItem, onDelete, readOnly = false }: {
  setEditingItem: Dispatch<SetStateAction<Barang | null>>,
  onDelete: (id: string) => void,
  readOnly?: boolean
}) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'username', desc: false },]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<Barang>[]>(() => {
    return [
      { accessorKey: 'nama', header: 'Barang' },
      { accessorKey: 'jenis', header: 'Jenis' },
      { accessorKey: 'qty', header: 'Quantity' },
      { accessorKey: 'tahunPengadaan', header: 'Tahun Pengadaan' },
      { accessorKey: 'kondisi', header: 'Kondisi' },
      { accessorKey: 'lokasi', header: 'Lokasi' },
      { accessorKey: 'statusOperasional', header: 'Status Op' },
      { accessorKey: 'ket', header: 'Keterangan' },
      { accessorKey: 'ip', header: 'IP Address' },
      { accessorKey: 'mac', header: 'Mac Address' },
      ...(readOnly ? [
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
    data: mock,
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
                <div className="d-flex align-items-center justify-content-between">
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