'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Button, Container, Modal } from 'react-bootstrap';
import InventoryForm from '../components/InventoryForm';
import InventoryList from '../components/InventoryList';
import Layout from '../components/Layout';

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showHomeModal, setShowHomeModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    const storedItems = localStorage.getItem('inventory');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, [user, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      localStorage.setItem('inventory', JSON.stringify(items));
    }
  }, [items, user]);

  const handleSave = (item) => {
    if (editingItem) {
      setItems(items.map((i) => (i.id === item.id ? item : i)));
      setEditingItem(null);
    } else {
      setItems([...items, item]);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  if (!user || user.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <Layout>
      <h1>Admin Manajemen Inventaris</h1>
      <Button variant="secondary" onClick={() => setShowHomeModal(true)} className="mb-3">
        Monitor Home Page
      </Button>
      <InventoryForm onSave={handleSave} editingItem={editingItem} />
      <h2 className="mt-4">Inventory List</h2>
      <InventoryList
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal show={showHomeModal} onHide={() => setShowHomeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Monitoring Home Page (User View)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <h2>Your Inventory View (Read-Only)</h2>
            <InventoryList items={items} onEdit={() => {}} onDelete={() => {}} readOnly={true} />
          </Container>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}