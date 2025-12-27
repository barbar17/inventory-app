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

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/${user?.role}/inventory`);
    }
  }, [user])

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    </Container>
  );
}