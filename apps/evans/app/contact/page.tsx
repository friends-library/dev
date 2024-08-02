import { t } from '@friends-library/locale';
import type { NextPage } from 'next';
import ContactFormPageContainer from './ContactFormPageContainer';
import sendSearchDataToAlgolia from '@/lib/ssg/algolia';
import { generatePodcastFeeds } from '@/lib/ssg/podcast';
import api from '@/lib/ssg/api-client';
import * as seo from '@/lib/seo';
import { LANG } from '@/lib/env';

interface PageData {
  prodBuildTaskTime?: string;
}

const Page: NextPage = async () => {
  const { prodBuildTaskTime } = await performStaticBuildTasks();
  return <ContactFormPageContainer _buildTime={prodBuildTaskTime} />;
};

async function performStaticBuildTasks(): Promise<PageData> {
  if (process.env.VERCEL_ENV !== `production`) {
    return {};
  }

  process.stdout.write(`Using contact form static build time for prod build tasks...\n`);
  await sendSearchDataToAlgolia();
  const pageProps = Object.values(await api.allDocumentPages(LANG));
  for (const page of pageProps) {
    generatePodcastFeeds(page.document);
  }

  return {
    prodBuildTaskTime: new Date().toISOString(),
  };
}

export default Page;

export const metadata = seo.nextMetadata(t`Contact Us`, seo.pageMetaDesc(`contact`, {}));

export const dynamic = `force-static`;
