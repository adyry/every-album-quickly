'use client';

import dynamic from 'next/dynamic';

const Component = dynamic(() => import('./Home'), { ssr: false });

export function ClientOnly() {
  return <Component />;
}
