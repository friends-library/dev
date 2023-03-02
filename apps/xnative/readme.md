## pnpm/monorepo hacks

- I had to install `@babel/runtime` in the monorepo _root_ in order to get the importing
  of untranspiled workspace typescript packages working with metro/react-native.

## webview function toString() issues

The new `hermes` js engine doesn't allow you to call `.toString()` on a function, because
all you get out is `[bytecode]`, but I use this in the webview code injection. If you add
`'show source'` somewhere in the function, it's supposed to preserve the source, but this
is buggy in debug mode. See this issue:

https://github.com/facebook/hermes/issues/612

I tested and it works fine in release mode, and trigging a hot module reload on the
`ebook-code.ts` file seems to fix it the problem while dev-ing, so I'm leaving things as
is for now.

See also:

https://github.com/facebook/hermes/issues/114
