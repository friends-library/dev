import css from 'x-syntax';

export default css`
  .body {
    font-size: 1.06rem;
  }

  p,
  .syllogism li,
  .chapter-synopsis li {
    line-height: 139%;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4 {
    font-size: 1rem;
  }

  h3,
  h4 {
    margin-top: 2.5em;
  }

  .chapter-heading__sequence {
    font-size: 1.1rem;
  }

  *::footnote-call {
    font-size: 0.83rem;
  }

  *::footnote-marker {
    font-size: 0.8rem;
  }

  .footnote {
    font-size: 0.85rem;
    line-height: 113%;
  }

  .copyright-page {
    font-size: 0.95rem;
  }

  .half-title-page .byline {
    font-size: 1.3rem;
  }

  .originally-titled__title {
    font-size: 1.3rem;
  }

  blockquote > p,
  blockquote .numbered-group p {
    line-height: 137%;
    padding-left: 1.65em;
  }

  blockquote {
    margin-right: 0;
    margin-left: 1em;
    border-left: dotted 1px #bbb;
  }

  figure.attributed-quote figcaption {
    text-align: right;
    font-style: italic;
    font-size: 0.85rem;
    margin-bottom: 1.5em;
    margin-top: -1em;
  }
`;
