'use client';

import TopNav from './TopNav';

export default function Template({ children }) {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
