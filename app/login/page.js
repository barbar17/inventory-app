'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Form, Button, Container, Alert, FloatingLabel } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin/inventory');
      } else {
        router.push('/');
      }
    }
  }, [user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      // Redirect handled by useEffect
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Container className="mt-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: "24px", alignItems: 'center', width: '100%' }}>
      <div className='w-100'>
        <h1 className="text-center fw-bold">SPP IT</h1>
        <h1 className="text-center fw-bold">BID TIK POLDA LAMPUNG</h1>
      </div>
      <div style={{ maxWidth: '35%' }} className='p-4 bg-white border rounded'>
        <h2 className='fw-bold mb-4'>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <FloatingLabel label='Username'>
              <Form.Control
                placeholder='Username'
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3">
            <FloatingLabel label='Password'>
              <Form.Control
                placeholder='Password'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FloatingLabel>
          </Form.Group>
          <Button type="submit" variant="primary">Login</Button>
        </Form>
        <p className="mt-3">Demo: admin/admin123 for admin, any other for user.</p>
      </div>
    </Container>
  );
}