import invariant from '@/lib/invariant';
import { LANG } from '@/lib/env';

invariant(
  process.env.SELLER_STREET_ADDRESS,
  `process.env.SELLER_STREET_ADDRESS is not defined`,
);

export const SELLER = {
  name: `Friends Library Publishing`,
  street: process.env.SELLER_STREET_ADDRESS,
  cityStateZip: `Wadsworth, OH 44281`,
  country: `United States of America`,
  email: LANG === `es` ? `info@bibliotecadelosamigos.org` : `info@friendslibrary.com`,
  websiteEn: `friendslibrary.com`,
  websiteEs: `bibliotecadelosamigos.org`,
  taxId: `94-3245128`,
  status: `501(c)(3) non-profit organization`,
} as const;
