'use client';

import SelectionManager from '../../Common/SelectionManager';

export default function Template({ children }) {
  return (
    <div>
      {children}
      <SelectionManager />
    </div>
  );
}
