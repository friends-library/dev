require('@friends-library/env/load');
const path = require(`path`);
const webpack = require(`webpack`);

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],

  typescript: {
    // TS 4.3 issue - @see https://github.com/styleguidist/react-docgen-typescript/issues/356
    // but I don't think i was using this anyway, this could speed up builds too, i think
    reactDocgen: false,
  },

  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // 'PRODUCTION' is used when building the static version of storybook.

    config.module.rules.push({
      test: /\.tsx?$/,
      use: [`ts-loader`],
      exclude: /node_modules\/(?!(@friends-library|x-syntax)\/).*/,
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      '@evans': path.resolve(__dirname, `../../evans/src/components/`),
    };

    config.resolve.extensions.push(`.ts`, `tsx`);

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.GATSBY_TEST_STRIPE_PUBLISHABLE_KEY': `"${process.env.GATSBY_TEST_STRIPE_PUBLISHABLE_KEY}"`,
        'process.env.GATSBY_PROD_STRIPE_PUBLISHABLE_KEY': `"${process.env.GATSBY_PROD_STRIPE_PUBLISHABLE_KEY}"`,
        'process.env.GATSBY_NETLIFY_CONTEXT': '""',
      }),
    );

    return config;
  },
};
