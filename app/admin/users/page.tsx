'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button } from 'react-bootstrap'
import Layout from '../../components/Layout';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';

interface User {
  username: string,
  role: string,
}

const users: User[] = [
  { username: 'admin1', role: 'admin' },
  { username: 'user1', role: 'user' },
]

const columns: ColumnDef<User>[] = [
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
        <Button variant="warning" size="sm" onClick={() => console.log(row.original)} className="me-2">Edit</Button>
        <Button variant="danger" size="sm" onClick={() => console.log(row.original)}>Delete</Button>
      </>
    )
  },
]

export default function ManageUsers() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'username', desc: false },]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [user, setUser] = useState<User[]>([])

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        const payload = await res.json()

        if (!res.ok) {
          alert(payload.error)
          return
        }

        setUser(payload)
      } catch(error) {
        alert(error)
      }
    }

    getUser()
  }, [])

  const table = useReactTable<User>({
    data: user,
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
    <Layout>
      <h1>Manage Users</h1>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">Add User</Button>
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

      {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => {console.log("save")}}>Save</Button>
        </Modal.Footer>
      </Modal> */}
    </Layout>
  );
}