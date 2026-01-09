'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import TableWrapper from './TableWrapper'
import { Table } from 'react-bootstrap';
import { Table as TableType, ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { Button, Form } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';

function DefaultTable<T>({ data, columns, defaultSort, tableWidth = "100%", loading, setTableComponent }: {
  data: T[],
  columns: ColumnDef<T, any>[],
  defaultSort: SortingState,
  tableWidth?: string,
  loading: boolean,
  setTableComponent?: Dispatch<SetStateAction<TableType<T> | null>>,
}) {
  const [sorting, setSorting] = useState<SortingState>(defaultSort);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
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
    if (setTableComponent) setTableComponent(table);
  }, [table])

  return (
    <>
      <div className="d-flex gap-2 justify-content-between align-items-center mb-2 mt-4">
        <div className='d-flex gap-2 text-center justify-content-end align-items-center'>
          <span>Show</span>
          <Form.Select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            style={{ width: "100px" }}
          >
            {[10, 20, 30, 50].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Form.Select>
          <span>Entries</span>
        </div>

        <Form.Control
          style={{ maxWidth: '300px' }}
          type="text"
          name="nama"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Cari...'
        />
      </div>
      <TableWrapper width={tableWidth}>
        <Table
          striped
          bordered
          hover
          responsive
          className="table table-bordered mb-0"
        >
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()} style={{ cursor: h.column.getCanSort() ? 'pointer' : 'default' }}>
                    <div className="d-flex align-items-end justify-content-between">
                      {flexRender(h.column.columnDef.header, h.getContext())}

                      {h.column.getCanSort() && (
                        <span>
                          {h.column.getIsSorted() === 'asc' && <i className="bi bi-sort-up fs-5"></i>}
                          {h.column.getIsSorted() === 'desc' && <i className="bi bi-sort-down fs-5"></i>}
                          {!h.column.getIsSorted() && <i className="bi bi-arrow-down-up fs-6"></i>}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="text-center py-4">
                  <div className='d-flex flex-column gap-2 align-items-center justify-content-center'>
                    <Spinner animation="border" />
                    <span className="ms-2">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.map(row => (
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
  )
}

export default DefaultTable