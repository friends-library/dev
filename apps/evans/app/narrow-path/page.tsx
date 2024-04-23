'use client';

import React from 'react';
import type { NextPage } from 'next';
import ConfirmationPage from '@/components/narrow-path/ConfirmationPage';

const SuccessPage: NextPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const result = urlParams.get(`result`);
  const action = urlParams.get(`action`);

  if (
    (result !== `success` && result !== `failure`) ||
    (action !== `emailConfirmation` && action !== `unsubscribe`)
  ) {
    return null;
  }

  return <ConfirmationPage result={result} action={action} />;
};

export default SuccessPage;
