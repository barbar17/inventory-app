'use client'
import { useAuth } from '@/app/components/AuthProvider'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { History } from '@/app/types/History'
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { Button, Table } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import TableWrapper from '@/app/components/TableWrapper'
import { toast } from 'react-toastify'

const columns: ColumnDef<History>[] = [
  {
    accessorKey: 'id',
    header: "ID",
  },
  {
    accessorKey: 'username',
    header: "Username",
  },
  {
    accessorKey: 'created_at',
    header: "Tgl Login",
    cell: ({ getValue }) => {
      const formatted = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(getValue() as string)).replaceAll('/', '-')

      return formatted
    }
  }
]

function LogHistory() {
  const { setLoading } = useAuth()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'created_at', desc: false },]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [history, setHistory] = useState<History[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await fetch(`/api/history`, { credentials: 'include' })
        const payload = await res.json()

        if (!res.ok) {
          toast.error(payload.error)
          return
        }

        setHistory(payload)
      } catch (error: any) {
        toast.error(error)
      } finally {
        setLoading(false)
      }
    }

    getHistory()
  }, [])

  const table = useReactTable<History>({
    data: history,
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <h1>History Login</h1>
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
      <TableWrapper>
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
                    <div className="d-flex align-items-center justify-content-between">
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
    </motion.div>
  )
}

export default LogHistory