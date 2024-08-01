import React from 'react';
import type { NextPage } from 'next';
import ConfirmationPage from '../ConfirmationPage';

const FailurePage: NextPage = () => <ConfirmationPage result="failure" />;

export default FailurePage;
