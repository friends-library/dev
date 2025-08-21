import React from 'react';
import { RequestFreeBooks } from '@evans/forms/RequestFreeBooks';
import { useAddress } from '@evans/forms/hooks';
import type { Meta } from '@storybook/nextjs';

export default {
  title: 'Misc/RequestFreeBooks', // eslint-disable-line
  parameters: { layout: `fullscreen` },
} as Meta;

export const Default = () => {
  const [addressProps, , addressValid] = useAddress({});
  return (
    <RequestFreeBooks
      addressProps={addressProps}
      addressIsValid={addressValid}
      state="default"
      initialTitles="La Senda Antigua — John Griffith"
      onSubmit={() => {}}
      onClose={() => {}}
    />
  );
};

export const Submitting = () => <RequestFreeBooks state="submitting" />;

export const SubmitSuccess = () => (
  <RequestFreeBooks state="submit_success" onClose={() => {}} initialTitles="" />
);

export const SubmitError = () => (
  <RequestFreeBooks
    state="submit_error"
    onRetry={() => {}}
    onClose={() => {}}
    initialTitles=""
  />
);
