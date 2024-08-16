'use client'

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthorization() {
      if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
        setIsAuthorized(true);
        return;
      }

      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setIsAuthorized(true);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Authorization check failed:', error);
        router.push('/login');
      }
    }
    checkAuthorization();
  }, [router]);

  if (!isAuthorized) {
    return <div>Checking authorization...</div>;
  }

  return <Layout>{children}</Layout>;
}