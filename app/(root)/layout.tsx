import React from 'react'
import Header from '@/components/ui/Header'
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

const layout = async ({children}: {children: React.ReactNode}) => {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if(!session?.user) redirect('/signin');
  
  const user = session.user;
  return (
     <main className='min-h-screen text-gray-400'>
          <Header user={user} />
          <div className='container py-10'>
          
      {children}
    </div>
     </main>
    
  )
}

export default layout
