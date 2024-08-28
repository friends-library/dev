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
      beforeFiles: [...rewriteStaticFiles(), ...rewriteLangPaths()],
    };
  },
  redirects: async function () {
    return [
      {
        source: `/static/:path*`,
        destination: `/:path*`,
        permanent: true,
      },
      ...redirectLangPaths(),
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);

// helpers

/** @returns {Array<{source: string, destination: string}>} */
function rewriteStaticFiles() {
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

/** @returns {Array<{source: string, destination: string}>} */
function rewriteLangPaths() {
  if (LANG === `en`) {
    return [
      {
        source: `/compilations`,
        destination: `/friend/compilations`,
      },
    ];
  } else {
    return [
      {
        source: `/compilaciones`,
        destination: `/amigo/compilaciones`,
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
        source: `/camino-estrecho/confirmar-correo/exito`,
        destination: `/narrow-path/confirm-email/success`,
      },
      {
        source: `/camino-estrecho/confirmar-correo/fallo`,
        destination: `/narrow-path/confirm-email/failure`,
      },
    ];
  }
}

/** @returns {Array<{source: string, destination: string, permanent: true}>} */
function redirectLangPaths() {
  if (LANG === `en`)
    return [
      {
        source: `/friend/compilations`,
        destination: `/compilations`,
        permanent: true,
      },
      {
        source: `/amigo/:path*`,
        destination: `/friend/:path*`,
        permanent: true,
      },
      {
        source: `/amiga/:path*`,
        destination: `/friend/:path*`,
        permanent: true,
      },
    ];
  return [
    {
      source: `/amigo/compilaciones`,
      destination: `/compilaciones`,
      permanent: true,
    },
    {
      source: `/amiga/compilaciones`,
      destination: `/compilaciones`,
      permanent: true,
    },
    {
      source: `/friend/:path*`,
      destination: `/amigo/:path*`,
      permanent: true,
    },
    {
      source: `/getting-started`,
      destination: `/comenzar`,
      permanent: true,
    },
    {
      source: `/explore`,
      destination: `/explorar`,
      permanent: true,
    },
    {
      source: `/audiobooks`,
      destination: `/audiolibros`,
      permanent: true,
    },
    {
      source: `/friends`,
      destination: `/amigos`,
      permanent: true,
    },
    {
      source: `/contact`,
      destination: `/contactanos`,
      permanent: true,
    },
  ];
}
