import { Dispatch, SetStateAction, useState, useMemo, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Barang } from '../types/Barang';
import { Table as TableType, ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import { Button } from 'react-bootstrap';
import TableWrapper from './TableWrapper';

const InventoryList = ({ handleEditItem, onDelete, setGlobalFilter, globalFilter, readOnly = false, setTableComponent, getBarang, barang }: {
  handleEditItem?: (barang: Barang) => void,
  setGlobalFilter: Dispatch<SetStateAction<string>>,
  onDelete?: (id: string, nama: string) => void,
  readOnly?: boolean,
  globalFilter: string,
  setTableComponent: Dispatch<SetStateAction<TableType<Barang> | null>>,
  getBarang: () => Promise<void>,
  barang: Barang[],
}) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'nama', desc: false },]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

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

  const table = useReactTable<Barang>({
    data: barang,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSortingRemoval: false,
  })

  useEffect(() => {
    setTableComponent(table);
  }, [table])

  return (
    <>
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
                          {h.column.getIsSorted() === 'asc' && <i className="bi bi-sort-up fs-5"></i>}
                          {h.column.getIsSorted() === 'desc' && <i className="bi bi-sort-down fs-5"></i>}
                          {!h.column.getIsSorted() && <i className="bi bi-arrow-down-up fs-5"></i>}
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
      <div style={{ marginTop: 8 }} className='d-flex align-items-center justify-content-end gap-2'>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}{table.getPageCount()}
        </span>

        <div className='d-flex gap-1'>
          <Button variant='outline-dark' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <i className="bi bi-chevron-double-left"></i>
          </Button>
          <Button variant='outline-dark' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <i className="bi bi-chevron-left"></i>
          </Button>
          <Button variant='outline-dark' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <i className="bi bi-chevron-right"></i>
          </Button>
          <Button variant='outline-dark' onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <i className="bi bi-chevron-double-right"></i>
          </Button>
        </div>
      </div>
    </>
  );
};

export default InventoryList;