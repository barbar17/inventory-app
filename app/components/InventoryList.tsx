import { Dispatch, SetStateAction, useState, useMemo, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Barang } from '../types/Barang';
import { Table as TableType, ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { Button } from 'react-bootstrap';
import TableWrapper from './TableWrapper';

const InventoryList = ({ setEditingItem, onDelete, setGlobalFilter, globalFilter, readOnly = false, setTableComponent, getBarang, barang }: {
  setEditingItem: Dispatch<SetStateAction<Barang | null>>,
  setGlobalFilter: Dispatch<SetStateAction<string>>,
  onDelete: (id: string, nama: string) => void,
  readOnly?: boolean,
  globalFilter: string,
  setTableComponent: Dispatch<SetStateAction<TableType<Barang> | null>>,
  getBarang: () => Promise<void>,
  barang: Barang[],
}) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'nama', desc: false },]);

  useEffect(() => {
    getBarang()
  }, [])

  useEffect(() => {
    console.log(barang)
  }, [barang])

  const columns = useMemo<ColumnDef<Barang>[]>(() => {
    return [
      { accessorKey: 'no', header: 'No', size: 60 },
      { accessorKey: 'nama', header: 'Barang' },
      { accessorKey: 'jenis', header: 'Jenis', size: 100 },
      { accessorKey: 'qty', header: 'Jumlah', size: 100 },
      {
        accessorKey: 'tahun_pengadaan', header: 'Tgl Pengadaan', cell: ({ getValue }) => {
          const value = getValue() as string; return value?.slice(0, 10)
        },
        meta: {
          print: (value) => String(value).slice(0, 10),
        }
      },
      { accessorKey: 'kondisi', header: 'Kondisi' },
      { accessorKey: 'lokasi', header: 'Lokasi' },
      {
        accessorKey: 'status_op', header: 'Status Op', size: 110, cell: ({ getValue }) => {
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
        { accessorKey: 'created_by', header: 'User Input', size: 120 },
        {
          accessorKey: 'created_at', header: 'Tgl Input', size: 120, cell: ({ getValue }: { getValue: any }) => {
            const value = getValue() as string; return value?.slice(0, 10)
          },
          meta: {
            print: (value: any) => String(value).slice(0, 10),
          }
        },
        {
          id: 'aksi', header: 'Aksi', cell: ({ row }: { row: any }) => (
            <>
              <Button variant="warning" size="sm" onClick={() => console.log(row.original)} className="me-2">Edit</Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(row.original.id, row.original.nama)}>Delete</Button>
            </>
          )
        },
      ] : [])
    ]
  }, [readOnly, barang]);

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

  useEffect(() => {
    setTableComponent(table);
  }, [table])

  return (
    <TableWrapper>
      <Table
        striped
        bordered
        hover
        className="table table-bordered mb-0"
        style={{
          tableLayout: 'fixed',
          minWidth: readOnly === true ? '150%' : '100%',
        }}
      >
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} onClick={h.column.getToggleSortingHandler()} style={{ cursor: h.column.getCanSort() ? 'pointer' : 'default', width: h.getSize() }}>
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
    </TableWrapper>
  );
};

export default InventoryList;