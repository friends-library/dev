import React from 'react';
import EvansClient from '@friends-library/pairql/evans';
import { t } from '@friends-library/locale';
import Seo, { pageMetaDesc } from '@/components/core/Seo';
import ContactFormBlock from '@/components/contact/FormBlock';
import { LANG } from '@/lib/env';

const ContactPage: React.FC = () => (
  <div>
    <Seo title={t`Contact Us`} description={pageMetaDesc(`contact`, {})} />
    <ContactFormBlock
      onSubmit={async (name, email, message, subject) => {
        const client = EvansClient.web(window.location.href, () => undefined);
        const result = await client.submitContactForm({
          lang: LANG,
          name,
          email,
          message,
          subject,
        });
        return result.isSuccess;
      }}
    />
  </div>
);

export default ContactPage;
