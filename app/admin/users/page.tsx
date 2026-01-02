'use client';
import { useState, useEffect, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { Table, Button, Modal } from 'react-bootstrap'
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { useAuth } from '@/app/components/AuthProvider';
import { motion } from 'motion/react'
import { User } from '@/app/types/User';
import TableWrapper from '@/app/components/TableWrapper';

const userDefault: User = {
  username: "",
  password: "",
  role: "user",
}

export default function ManageUsers() {
  const { setLoading, isChecking } = useAuth()
  const [showModal, setShowModal] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'username', desc: false },]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User>(userDefault);
  const [editingUser, setEditingUser] = useState<boolean>(false);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        const payload = await res.json()

        if (!res.ok) {
          alert(payload.error)
          return
        }

        setUsers(payload)
      } catch (error) {
        alert(error)
      }
    }

    getUser()
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [isChecking])

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(user)
  }

  const columns = useMemo<ColumnDef<User>[]>(() => {
    return [
      {
        accessorKey: 'username',
        header: "Username",
      },
      {
        accessorKey: 'role',
        header: "Role",
      },
      {
        id: 'aksi',
        header: "Aksi",
        cell: ({ row }) => (
          <>
            <Button variant="warning" size="sm" onClick={() => {
              setUser({
                username: row.original.username,
                password: row.original.password,
                role: row.original.role
              });
              setEditingUser(true);
              setShowModal(true);
            }} className="me-2">Edit</Button>
            <Button variant="danger" size="sm" onClick={() => console.log(row.original)}>Delete</Button>
          </>
        )
      },
    ]
  }, [])

  const table = useReactTable<User>({
    data: users,
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
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h1>Manajemen Users</h1>
      <div className="d-flex justify-content-between align-items-center">
        <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">Tambah User</Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button variant="primary" type='submit'>Simpan</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </motion.div>
  );
}