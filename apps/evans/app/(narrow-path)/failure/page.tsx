import React from 'react';
import type { NextPage } from 'next';
import ConfirmationPage from '@/components/narrow-path/ConfirmationPage';

const FailurePage: NextPage = () => <ConfirmationPage type="error" />;

export default FailurePage;
