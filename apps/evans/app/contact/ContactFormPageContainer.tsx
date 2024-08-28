'use client';

import React, { useState } from 'react';
import EvansClient from '@friends-library/pairql/evans';
import ContactFormPage from './ContactFormPage';
import { LANG } from '@/lib/env';

interface Props {
  _buildTime?: string;
}

export const Container: React.FC<Props> = ({ _buildTime }) => {
  const [name, setName] = useState<string>(``);
  const [email, setEmail] = useState<string>(``);
  const [message, setMessage] = useState<string>(``);
  const [subject, setSubject] = useState<'tech' | 'other'>(`tech`);
  const [success, setSuccess] = useState<boolean>(false);
  const [state, setState] = useState<'default' | 'submitting' | 'submitted'>(`default`);
  return (
    <ContactFormPage
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      message={message}
      setMessage={setMessage}
      subject={subject}
      setSubject={setSubject}
      state={state}
      success={success}
      onSubmit={async () => {
        setSuccess(false);
        setState(`submitting`);
        const client = EvansClient.web(window.location.href, () => undefined);
        const result = await client.submitContactForm({
          lang: LANG,
          name,
          email,
          message,
          subject,
        });
        setSuccess(result.isSuccess);
        if (result.isSuccess) {
          setMessage(``);
        }
        setState(`submitted`);
      }}
      _buildTime={_buildTime}
    />
  );
};

export default Container;
