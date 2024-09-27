'use client';

import dynamic from 'next/dynamic';

const Component = dynamic(() => import('./AuthCallback'), { ssr: false });

export function ClientOnly() {
  return <Component />;
}
