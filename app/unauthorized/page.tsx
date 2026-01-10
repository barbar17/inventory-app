'use client';
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { useAuth } from "../components/AuthProvider";

const Unauthorized = () => {
  const {logout} = useAuth();
  const router = useRouter();
  return (
    <>
      <style jsx global>{`
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: black;
          color: white;
        }

        .unauthorized-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
        }
      `}</style>

      <div className="unauthorized-container">
        <h1>Unauthorized</h1>
        <p>Anda tidak memiliki akses ke halaman ini.</p>
        <div className="d-flex gap-4">
        <Button variant="primary" onClick={router.back}>Back</Button>
        <Button variant="warning" onClick={logout}>Go to Login</Button>
        </div>
      </div>
    </>
  );
}

export default Unauthorized