import Client, { type T as Api } from '@friends-library/pairql/evans-build';
import { notFound } from 'next/navigation';

export type { Api };

let _client: Client | null = null;
let _friendPages: Promise<Api.AllFriendPages.Output> | null = null;
let _documentPages: Promise<Api.AllDocumentPages.Output> | null = null;

function createClient(): Client {
  if (_client !== null) {
    return _client;
  }

  const client = Client.node(process);
  _client = client;

  const shouldBatchQueries = process.env.CI || process.env.VERCEL;
  if (!shouldBatchQueries) {
    return client;
  }

  _client.friendPage = async (input) => {
    if (_friendPages === null) {
      _friendPages = client.allFriendPages(input.lang);
    }
    return _friendPages.then((allPages) => {
      const page = allPages[input.slug];
      if (!page) notFound();
      return page;
    });
  };

  _client.documentPage = async (input) => {
    if (_documentPages === null) {
      _documentPages = client.allDocumentPages(input.lang);
    }
    return _documentPages.then((allPages) => {
      const key = `${input.friendSlug}/${input.documentSlug}`;
      const page = allPages[key];
      if (!page) notFound();
      return page;
    });
  };

  return _client;
}

export default createClient();
