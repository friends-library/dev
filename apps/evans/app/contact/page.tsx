import { t } from '@friends-library/locale';
import ContactFormPageContainer from './ContactFormPageContainer';
import * as seo from '@/lib/seo';

export default ContactFormPageContainer;

export const metadata = seo.nextMetadata(t`Contact Us`, seo.pageMetaDesc(`contact`, {}));

export const dynamic = `force-static`;
