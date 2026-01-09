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
import DefaultTable from '@/app/components/DefaultTable'

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

const defaultSort: SortingState = [{ id: 'created_at', desc: false }]

function LogHistory() {
  const { setLoading } = useAuth()
  const [history, setHistory] = useState<History[]>([])

  useEffect(() => {
    const getHistory = async () => {
      setLoading(true)
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <h1>History Login</h1>
      
      <DefaultTable<History>
        data={history}
        columns={columns}
        defaultSort={defaultSort}
      />
    </motion.div>
  )
}

export default LogHistory