'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Form, Button, Container, FloatingLabel } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { UserCtx } from '../types/User';
import { toast } from 'react-toastify';

export default function Login() {
  const { setUser, setLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
        toast.error(payload.error);
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
    } catch (error: any) {
      toast.error(String(error))
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <Container className="mt-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: "24px", alignItems: 'center', width: '100%' }}>
      <div className='w-100'>
        <h1 className="text-center fw-bold">SPP IT</h1>
        <h1 className="text-center fw-bold">BID TIK POLDA LAMPUNG</h1>
      </div>
      <div className='p-4 bg-white border rounded'>
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
          <Form.Group className="mb-3 password-wrapper">
            <FloatingLabel label='Password' className='d-flex justify-content-between align-items-center'>
              <Form.Control
                name='password'
                className='password-input'
                placeholder='Password'
                type={showPassword ? "text" : "password"}
                defaultValue=""
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <i className="bi bi-eye fs-5"></i> : <i className="bi bi-eye-slash fs-5"></i>}
              </span>
            </FloatingLabel>
          </Form.Group>
          <Button type="submit" variant="primary">Login</Button>
        </Form>
        <p className="mt-3">Demo: admin/admin123 for admin, any other for user.</p>
      </div>
    </Container>
  );
}