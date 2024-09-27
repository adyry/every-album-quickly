'use client';

import TopNav from './TopNav';

export default function Template({ children }) {
  return (
    <div className="mx-auto max-w-[1200px] p-4">
      <TopNav />
      {children}
    </div>
  );
}
