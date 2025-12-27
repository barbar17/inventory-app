'use client';

import { useAuth } from './components/AuthProvider';
import { Button, Container, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import InventoryList from './components/InventoryList';
import DownloadButtons from './components/DownloadButtons';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, logout, loading } = useAuth();
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedItems = localStorage.getItem('inventory');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      if (user.role === 'admin') {
        router.push('/admin/inventory');
      }
    }
  }, [user])

  return (
    <Container className="mt-5">
      <h1 className="text-center">Sistem Pendataan Perangkat jaringan dan IT  BID TIK POLDA LAMPUNG</h1>
      {user ? (
        <div>
          <p className="text-center">Hello, {user.username} ({user.role})!</p>
          {user.role === 'admin' ? (
            <div className="text-center">
              <Link href="/admin/inventory">
                <Button variant="primary" className="me-2">Go to Admin Inventory</Button>
              </Link>
              <Button variant="secondary" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div>
              <h2>Your Inventory View (Read-Only)</h2>
              <DownloadButtons items={items} />
              <InventoryList items={items} onEdit={() => {}} onDelete={() => {}} readOnly={true} />
              <div className="text-center mt-3">
                <Button variant="secondary" onClick={logout}>Logout</Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p>Please log in to access features.</p>
          <Link href="/login">
            <Button variant="primary">Login</Button>
          </Link>
        </div>
      )}
    </Container>
  );
}