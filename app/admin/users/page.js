'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import Layout from '../../components/Layout';

export default function ManageUsers() {
  const { user, users, addUser, updateUser, deleteUser } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  const handleSave = () => {
    if (!newUser.username || !newUser.password) {
      setError('Username dan password wajib diisi');
      return;
    }
    if (editingUser) {
      updateUser(editingUser.id, newUser);
    } else {
      addUser(newUser);
    }
    setShowModal(false);
    setNewUser({ username: '', password: '', role: 'user' });
    setEditingUser(null);
    setError('');
  };

  const handleEdit = (u) => {
    setEditingUser(u);
    setNewUser({ username: u.username, password: u.password, role: u.role });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin hapus user ini?')) {
      deleteUser(id);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <Layout>
      <h1>Manage Users</h1>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">Add User</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(u)} className="me-2">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
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
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}