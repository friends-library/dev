import algoliasearch from 'algoliasearch/lite';

export function getClient(): ReturnType<typeof algoliasearch> {
  const baseClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? ``,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_KEY ?? ``,
  );

  return {
    ...baseClient,
    search(requests: any) {
      if (
        requests.every(({ params }: any) => !params.query || params.query.length === 1)
      ) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            processingTimeMS: 0,
          })),
        });
      }

      return baseClient.search(requests);
    },
  };
}
