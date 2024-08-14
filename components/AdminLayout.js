import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './Layout';

export default function AdminLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthorization() {
      const response = await fetch('/api/auth/check');
      if (response.ok) {
        setIsAuthorized(true);
      } else {
        router.push('/login');
      }
    }
    checkAuthorization();
  }, []);

  if (!isAuthorized) {
    return <div>Checking authorization...</div>;
  }

  return <Layout>{children}</Layout>;
}