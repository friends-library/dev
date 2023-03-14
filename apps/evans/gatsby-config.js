require(`@friends-library/env/load`);

const LANG = process.env.GATSBY_LANG === `es` ? `es` : `en`;

module.exports = {
  flags: { PRESERVE_WEBPACK_CACHE: true, FAST_DEV: true },
  siteMetadata: {
    siteUrl:
      LANG === `en`
        ? `https://www.friendslibrary.com`
        : `https://www.bibliotecadelosamigos.org`,
    title: LANG === `en` ? `Friends Library` : `La Biblioteca de los Amigos`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: LANG === `en` ? `Friends Library` : `Biblioteca de los Amigos`,
        short_name: LANG === `en` ? `Friends Library` : `Biblioteca de los Amigos`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: LANG === `es` ? `#c18c59` : `#6c3142`,
        display: `minimal-ui`,
        icon: `${__dirname}/src/images/favicon_${LANG}.png`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `mdx`,
        path: `${__dirname}/src/mdx`,
        ignore: [`**/*.${LANG === `en` ? `es` : `en`}.mdx`],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-preact`,

    `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-google-fonts-with-attributes`,
      options: {
        fonts: [`cabin`],
        display: `swap`,
        attributes: {
          rel: `stylesheet preload prefetch`,
        },
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: require.resolve(`./src/templates/StaticPage.tsx`),
        },
      },
    },
    {
      resolve: `gatsby-plugin-webpack-bundle-analyzer`,
      options: {
        production: true,
        disable: process.env.ANALYZE_BUNDLE_SIZE !== `true`,
        generateStatsFile: true,
        analyzerMode: `static`,
      },
    },
  ],
};
