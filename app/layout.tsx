import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './global.css';
import { AuthProvider } from './components/AuthProvider';

export const metadata = {
  title: 'Inventory Manager',
  description: 'App for recording inventory of goods and IT network devices',
};

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}