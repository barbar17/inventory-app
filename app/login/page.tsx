'use client';

import { useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Form, Button, Container, FloatingLabel } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { UserCtx } from '../types/User';

export default function Login() {
  const { setUser, setLoading, isChecking } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: String(data.username).trim(),
          password: String(data.password).trim(),
        })
      })

      const payload = await res.json()
      if (!res.ok) {
        alert(payload.error);
        setLoading(false);
        return
      }
      const user: UserCtx = {
        username: payload.username,
        role: payload.role,
        isAuth: true
      }
      setUser(user)
      router.replace(`/${payload.role}/inventory`)
    } catch (error) {
      alert(error)
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [isChecking])

  return (
    <Container className="mt-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: "24px", alignItems: 'center', width: '100%' }}>
      <div className='w-100'>
        <h1 className="text-center fw-bold">SPP IT</h1>
        <h1 className="text-center fw-bold">BID TIK POLDA LAMPUNG</h1>
      </div>
      <div style={{ maxWidth: '35%' }} className='p-4 bg-white border rounded'>
        <h2 className='fw-bold mb-4'>Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <FloatingLabel label='Username'>
              <Form.Control
                name='username'
                placeholder='Username'
                type="text"
                defaultValue=""
                required
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3">
            <FloatingLabel label='Password'>
              <Form.Control
                name='password'
                placeholder='Password'
                type="password"
                defaultValue=""
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