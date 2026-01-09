'use client';
import { useState, useEffect, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { Button, Modal } from 'react-bootstrap'
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useAuth } from '@/app/components/AuthProvider';
import { motion } from 'motion/react'
import { User } from '@/app/types/User';
import DefaultTable from '@/app/components/DefaultTable';
import { toast } from 'react-toastify';
import ConfirmModal from '@/app/components/ConfirmModal';

const userDefault: User = {
  username: "",
  password: "",
  role: "user",
}

const defaultSort: SortingState = [{ id: 'username', desc: false }]

export default function ManageUsers() {
  const { setLoading } = useAuth()
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User>(userDefault);
  const [deleteUser, setDeleteUser] = useState<{ id: string, nama: string } | null>(null);
  const [editingUser, setEditingUser] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const getUser = async () => {
    setTableLoading(true);
    try {
      const res = await fetch("/api/user", { credentials: "include" });
      const payload = await res.json()

      if (!res.ok) {
        toast.error(payload.error)
        return
      }

      setUsers(payload)
    } catch (error: any) {
      toast.error(String(error))
    } finally {
      setTableLoading(false);
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleSubmit = (tipe: string) => {
    setLoading(true)
    if (tipe === "tambah") {
      onTambah();
    } else if (tipe === "edit") {
      onUpdate();
    }
  }

  const onTambah = async () => {
    try {
      const res = await fetch(`/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })

      const payload = await res.json();
      if (!res.ok) {
        setLoading(false);
        toast.error(payload.error);
        return
      }

      setShowModal(false);
      getUser();
      toast.success("Berhasil menambah user!");
      setUser(userDefault);
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoading(false)
    }
  }

  const onDelete = (id: string, nama: string) => {
    setShowConfirm(true);
    setDeleteUser({ id: id, nama: nama });
  }

  const onConfirmDelete = async () => {
    if (!deleteUser || deleteUser.id === "") toast.error("ID tidak boleh kosong");

    setLoading(true);
    try {
      const res = await fetch(`/api/user/${deleteUser?.id}`, {
        method: "DELETE"
      })

      const payload = await res.json();
      if (!res.ok) {
        toast.error(payload.error)
        return
      }

      toast.success(`Berhasil hapus ${deleteUser?.nama}`)
      getUser();
    } catch (error: any) {
      toast.error(String(error))
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setDeleteUser(null);
    }
  }

  const onUpdate = async () => {
    if (!user.id) toast.error("ID tidak boleh kosong");

    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })

      const payload = await res.json();
      if (!res.ok) {
        toast.error(payload.error);
        setLoading(false);
        return
      }

      setShowModal(false);
      getUser();
      toast.success("Berhasil update user!");
      setUser(userDefault);
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoading(false)
    }
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
                id: row.original.id,
                username: row.original.username,
                password: row.original.password,
                role: row.original.role
              });
              setEditingUser(true);
              setShowModal(true);
            }} className="me-2">Edit</Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(String(row.original.id), row.original.username)}>Delete</Button>
          </>
        )
      },
    ]
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="d-flex justify-content-between align-items-between">
        <h1>Manajemen Users</h1>
        <Button variant="primary" onClick={() => {
          if (editingUser) {
            setUser(userDefault);
          }
          setEditingUser(false)
          setShowModal(true)
        }} className="mb-3">Tambah User</Button>
      </div>
      <DefaultTable<User>
        loading={tableLoading}
        data={users}
        columns={columns}
        defaultSort={defaultSort}
      />

      <Modal show={showModal} onHide={() => { setShowModal(false) }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Form>
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
            <Button variant="primary" type='button' onClick={() => handleSubmit(editingUser ? "edit" : "tambah")}>Simpan</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        item={deleteUser}
        handleConfirm={onConfirmDelete}
      />
    </motion.div>
  );
}