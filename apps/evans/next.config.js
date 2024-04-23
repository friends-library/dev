// @ts-check
const { readFileSync } = require(`node:fs`);
const withBundleAnalyzer = require(`@next/bundle-analyzer`)({
  enabled: process.env.ANALYZE === `true`,
});
// load env from monorepo root
require(`dotenv`).config({ path: `../../.env` });
const LANG = process.env.NEXT_PUBLIC_LANG || `en`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [`@friends-library`, `x-syntax`],
  rewrites: async function () {
    return {
      afterFiles: [],
      fallback: [],
      beforeFiles: [
        ...staticFiles(),
        {
          source: `/amigo/:path*`,
          destination: `/friend/:path*`,
        },
        {
          source: `/amiga/:path*`,
          destination: `/friend/:path*`,
        },
        {
          source: `/compilaciones`,
          destination: `/friend/compilaciones`,
        },
        {
          source: `/compilations`,
          destination: `/friend/compilations`,
        },
        {
          source: `/comenzar`,
          destination: `/getting-started`,
        },
        {
          source: `/explorar`,
          destination: `/explore`,
        },
        {
          source: `/audiolibros`,
          destination: `/audiobooks`,
        },
        {
          source: `/amigos`,
          destination: `/friends`,
        },
        {
          source: `/contactanos`,
          destination: `/contact`,
        },
        {
          source: `/el-camino-estrecho`,
          destination: `/narrow-path`,
        },
      ],
    };
  },
  redirects: async function () {
    return [
      {
        source: `/static/:path*`,
        destination: `/:path*`,
        permanent: true,
      },
      {
        source: `/friend/compilations`,
        destination: `/compilations`,
        permanent: true,
      },
      {
        source: `/amiga/compilaciones`,
        destination: `/compilaciones`,
        permanent: true,
      },
      {
        source: `/amigo/compilaciones`,
        destination: `/compilaciones`,
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);

function staticFiles() {
  /** @type {Array<[string, string | null]>} */
  const pages = JSON.parse(readFileSync(`${__dirname}/static-pages.json`, `utf8`));
  if (LANG === `en`) {
    return pages
      .map(([en]) => en)
      .map((slug) => ({
        source: `/${slug}`,
        destination: `/static/${slug}`,
      }));
  } else {
    return pages
      .filter(([, es]) => es !== null)
      .map(([en, es]) => ({
        source: `/${es}`,
        destination: `/static/${en}`,
      }));
  }
}
