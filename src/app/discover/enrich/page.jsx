import dynamic from 'next/dynamic';

const Component = dynamic(() => import('./Enrich'), { ssr: false });

export default function Page() {
  return <Component />;
}
