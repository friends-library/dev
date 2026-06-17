import css from 'x-syntax';

export default css`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .verse-stanza {
    page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
  }

  .verse-stanza--long {
    page-break-inside: auto;
    -webkit-column-break-inside: auto;
  }

  .signed-section-signature,
  .signed-section-context-close,
  blockquote + figcaption {
    page-break-before: avoid;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .letter-heading,
  .salutation,
  .signed-section-context-open {
    page-break-after: avoid;
    -webkit-column-break-after: avoid;
  }

  .chapter--no-signed-section p {
    widows: 2;
    orphans: 2;
  }

  .footnote {
    widows: 2;
    orphans: 2;
  }
`;
