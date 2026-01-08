'use client'
import { useAuth } from '@/app/components/AuthProvider'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { History } from '@/app/types/History'
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { Table } from 'react-bootstrap'
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
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
      <div className="d-flex justify-content-end align-items-center mb-2">
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
    </motion.div>
  )
}

export default LogHistory