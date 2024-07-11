import React from 'react';
import type { NextPage } from 'next';
import ConfirmationPage from '@/components/narrow-path/ConfirmationPage';

const FailurePage: NextPage = () => <ConfirmationPage result="failure" />;

export default FailurePage;
