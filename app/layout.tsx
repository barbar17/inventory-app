import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "react-toastify/dist/ReactToastify.css";
import './global.css';
import { AuthProvider } from './components/AuthProvider';
import { ToastContainer } from 'react-toastify';

export const metadata = {
  title: 'Inventory Manager',
  description: 'App for recording inventory of goods and IT network devices',
};

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="en">
      <body style={{paddingBottom: "100px"}}>
        <AuthProvider>
          <ToastContainer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}