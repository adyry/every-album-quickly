import dynamic from 'next/dynamic';

const Component = dynamic(() => import('./PlaylistDiscovery'), { ssr: false });

export default function Page() {
  return <Component />;
}
