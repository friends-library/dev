import css from 'x-syntax';

export default css`
  html {
    font-size: 12.5pt;
  }

  .blank-page {
    display: none;
  }

  @page {
    size: 8.5in 11in;
    margin: 0.75in;
    margin-bottom: 0.95in;

    @footnotes {
      margin-top: 1.5rem;
    }

    @top-center {
      content: normal !important;
    }

    @bottom-center {
      margin-top: 0.2in;
    }
  }

  /* typography tweaks */
  p,
  li,
  dd,
  .signed-section-context-close,
  .signed-section-context-open {
    font-size: 0.875rem;
    line-height: 160%;
  }

  .paragraph {
    text-indent: 0;
  }

  .paragraph + .paragraph {
    margin-top: 0.85rem;
  }

  .chapter blockquote > p + p,
  .chapter blockquote .numbered-group p + p {
    margin-top: 0.7rem;
  }

  blockquote {
    margin-right: 0;
    padding-right: 0;
    border-left: dotted 1px #aaa;
  }

  .toc p {
    font-size: 0.95rem;
  }

  .footnote {
    font-size: 0.75rem;
  }

  .half-title-page {
    height: 8in; /* 11 minus margins, minus fudge */
  }

  .copyright-page {
    height: 9in; /* 11 minus margins */
  }

  .original-title-page,
  .copyright-page,
  .toc {
    display: none;
  }

  div.asterism {
    font-size: 0.81rem;
  }

  h2 {
    margin-top: 60pt;
  }

  .intermediate-title {
    padding-left: 4em;
    padding-right: 4em;
  }

  .sect1.intermediate-title .chapter-heading h2 {
    font-size: 1.6rem;
  }

  .sect1.intermediate-title .division h3 {
    font-size: 1.25rem;
  }

  .intermediate-title::after,
  .intermediate-title::before {
    content: '* * *';
    letter-spacing: 0.25em;
    display: block;
    margin: 2em 0;
    text-align: center;
    font-size: 1.25em;
  }

  .intermediate-title::after {
    margin-top: 3em;
    margin-bottom: 1em;
  }

  .intermediate-title h2 {
    margin-top: 0;
  }

  .numbered p {
    margin: 1em 0;
  }

  .poetry {
    font-size: 90%;
  }
`;
