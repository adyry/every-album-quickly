'use client';

import TopNav from './TopNav';

export default function Template({ children }) {
  return (
    <div className="mx-auto min-h-screen max-w-[500px] p-4 md:max-w-screen-xl">
      <TopNav />
      {children}
    </div>
  );
}
