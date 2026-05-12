'use client';

import React from 'react';
import { t } from '@friends-library/locale';

const PrintButton: React.FC = () => (
  <button
    type="button"
    onClick={() => window.print()}
    className="print:hidden bg-flprimary text-white px-4 py-2 rounded font-sans text-sm hover:bg-flprimary/90 transition-colors"
  >
    {t`Print Invoice`}
  </button>
);

export default PrintButton;
