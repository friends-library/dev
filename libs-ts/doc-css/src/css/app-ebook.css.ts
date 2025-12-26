import css from 'x-syntax';

export default css`
  html {
    font-family: 'Noto Serif', Iowan, Georgia, 'Times New Roman', Times, serif;
    -webkit-overflow-scrolling: touch;
    -webkit-font-smoothing: antialiased;
  }

  html {
    font-size: 20px;
    padding: 1em;
  }

  html.font-size--1 {
    font-size: 12px;
  }

  html.font-size--2 {
    font-size: 14px;
  }

  html.font-size--3 {
    font-size: 16px;
  }

  html.font-size--4 {
    font-size: 18px;
  }

  html.font-size--5 {
    font-size: 20px;
  }

  html.font-size--6 {
    font-size: 22px;
    padding: 0.8em;
  }

  html.font-size--7 {
    font-size: 24px;
    padding: 0.7em;
  }

  html.font-size--8 {
    font-size: 26px;
    padding: 0.6em;
  }

  html.font-size--9 {
    font-size: 28px;
    padding: 0.5em;
  }

  html.font-size--10 {
    font-size: 30px;
    padding: 0.4em;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .paragraph {
    margin-bottom: 0.5em;
    line-height: 150%;
    -webkit-hyphens: auto !important;
  }

  .chapter-1 {
    padding-top: 6rem;
  }

  .chapter + .chapter {
    padding-top: 25vh;
  }

  .chapter:last-of-type {
    margin-bottom: 25vh;
  }

  .footnote,
  .footnote-content {
    display: none;
  }

  .footnote.prepared {
    display: inline;
  }

  .fn-close {
    font-weight: 700;
  }

  a.__xref-linkable-back {
    display: inline;
  }

  .colorscheme--white .fn-close,
  .colorscheme--white .__xref,
  .colorscheme--white .footnote-marker {
    color: var(--ebook-colorscheme-white-accent, rgba(0, 0, 255));
  }

  .colorscheme--black .fn-close,
  .colorscheme--black .__xref,
  .colorscheme--black .footnote-marker {
    color: var(--ebook-colorscheme-black-accent, rgba(110, 141, 234));
  }

  .colorscheme--sepia .fn-close,
  .colorscheme--sepia .__xref,
  .colorscheme--sepia .footnote-marker {
    color: var(--ebook-colorscheme-sepia-accent, rgb(201, 154, 61));
  }

  .footnote-marker {
    font-size: 1em;
    margin-left: -0.15rem;
    display: inline-block;
    transform: translateY(-0.4rem);
    vertical-align: baseline;
  }

  .increase-clickable {
    display: inline-block;
  }

  .increase-clickable::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3.5em;
    height: 3.5em;
    transform: translate(calc(0.5em - 50%), calc(0.5em - 50%));
  }

  .footnote--visible .footnote-marker {
    opacity: 0;
    transform: translateX(-1000rem);
  }

  #fn-overlay {
    position: fixed;
    display: none;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
  }

  .colorscheme--white #fn-overlay,
  .colorscheme--white #fn-content {
    background: var(--ebook-colorscheme-white-bg, rgb(253, 253, 253));
  }

  .colorscheme--black #fn-overlay,
  .colorscheme--black #fn-content {
    background: var(--ebook-colorscheme-black-bg, rgb(0, 0, 0));
  }

  .colorscheme--sepia #fn-overlay,
  .colorscheme--sepia #fn-content {
    background: var(--ebook-colorscheme-sepia-bg, rgb(250, 242, 231));
  }

  .footnote--visible #fn-overlay {
    display: block;
  }

  .footnote--visible .chapter {
    display: none; /* android only, to prevent scroll whack jank */
  }

  .footnote--visible body {
    overflow: hidden;
  }

  #fn-close {
    z-index: 50;
    position: absolute;
    top: -6px;
    left: 4px;
    padding: 20px 1em 1em 1em;
    font-size: 22px !important;
  }

  #fn-close.increase-clickable::after {
    left: 15px;
    top: 0;
    height: 120px;
    width: 100px;
  }

  .fn-close-back {
    display: inline-block;
    transform: scale(1.3);
    padding-left: 0.4em;
  }

  .fn-close-back.increase-clickable::after {
    left: 10px;
  }

  #fn-content {
    position: relative;
    overflow: scroll;
    max-height: 100vh;
    padding: 15px 30px 1rem 60px;
  }

  #fn-content-inner {
    padding-bottom: 10rem;
  }

  #fn-content-inner,
  #fn-content-inner > * {
    font-size: 0.9em;
    line-height: 150%;
    -webkit-hyphens: auto !important;
  }

  #fn-content-inner .footnote-paragraph {
    font-size: 1.1111111em;
  }

  .colorscheme--white body {
    background: var(--ebook-colorscheme-white-bg, rgb(253, 253, 253));
    color: var(--ebook-colorscheme-white-fg, rgb(3, 3, 3));
  }

  .colorscheme--black body {
    background: var(--ebook-colorscheme-black-bg, black);
    color: var(--ebook-colorscheme-black-fg, rgb(169, 169, 169));
  }

  .colorscheme--sepia body {
    background: var(--ebook-colorscheme-sepia-bg, rgb(250, 242, 231));
    color: var(--ebook-colorscheme-sepia-fg, rgb(50, 50, 50));
  }

  .embedded-content-document {
    margin-left: 0;
  }

  /* UN-justify */
  dd,
  .discourse-part,
  .paragraph,
  .offset,
  .paragraph.offset,
  .heading-continuation-blurb,
  .section-summary-preface,
  h3.inline,
  h4.inline,
  h5.inline,
  #fn-content-inner,
  #fn-content-inner > * {
    text-align: left;
  }

  .chapter {
    /* don't let e-reader text grow too wide for comfortable reading */
    max-width: 55ch;
  }

  /* keep e-reader text centered, when line length constrained */
  .chapter-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* breakpoint "ipad" in native app */
  @media (min-width: 767px) {
    html.font-size--6 {
      padding: 2.75em;
    }

    html.font-size--7 {
      padding: 2.5em;
    }

    html.font-size--8 {
      padding: 2em;
    }

    html.font-size--9 {
      padding: 1.75em;
    }

    html.font-size--10 {
      padding: 1.5em;
    }

    .paragraph {
      line-height: 165%;
    }
  }

  /* breakpoint "ipad-lg" in native app */
  @media (min-width: 1025px) {
    .paragraph {
      line-height: 165%;
      margin-bottom: 0.75em;
    }
  }

  /* only allow justification for small screens when <= font-size 6 */
  .align--justify.font-size-lte--6 dd,
  .align--justify.font-size-lte--6 .discourse-part,
  .align--justify.font-size-lte--6 .paragraph,
  .align--justify.font-size-lte--6 .offset,
  .align--justify.font-size-lte--6 .paragraph.offset,
  .align--justify.font-size-lte--6 .heading-continuation-blurb,
  .align--justify.font-size-lte--6 .section-summary-preface,
  .align--justify.font-size-lte--6 h3.inline,
  .align--justify.font-size-lte--6 h4.inline,
  .align--justify.font-size-lte--6 h5.inline,
  .align--justify.font-size-lte--6 #fn-content-inner,
  .align--justify.font-size-lte--6 #fn-content-inner > * {
    text-align: justify;
  }

  /* only allow justification for medium screens when <= font-size 7 */
  @media (min-width: 767px) {
    .align--justify.font-size-lte--7 dd,
    .align--justify.font-size-lte--7 .discourse-part,
    .align--justify.font-size-lte--7 .paragraph,
    .align--justify.font-size-lte--7 .offset,
    .align--justify.font-size-lte--7 .paragraph.offset,
    .align--justify.font-size-lte--7 .heading-continuation-blurb,
    .align--justify.font-size-lte--7 .section-summary-preface,
    .align--justify.font-size-lte--7 h3.inline,
    .align--justify.font-size-lte--7 h4.inline,
    .align--justify.font-size-lte--7 h5.inline,
    .align--justify.font-size-lte--7 #fn-content-inner,
    .align--justify.font-size-lte--7 #fn-content-inner > * {
      text-align: justify;
    }
  }

  /* allow justification for any font size at large screens */
  @media (min-width: 819px) {
    .align--justify.align--justify dd,
    .align--justify.align--justify .discourse-part,
    .align--justify.align--justify .paragraph,
    .align--justify.align--justify .offset,
    .align--justify.align--justify .paragraph.offset,
    .align--justify.align--justify .heading-continuation-blurb,
    .align--justify.align--justify .section-summary-preface,
    .align--justify.align--justify h3.inline,
    .align--justify.align--justify h4.inline,
    .align--justify.align--justify h5.inline,
    .align--justify.align--justify #fn-content-inner,
    .align--justify.align--justify #fn-content-inner > * {
      text-align: justify;
    }
  }

  /* BEGIN new footnote dismissal from v2.1.0 (iPad support) */
  .version--gte-2_1_0.header--visible #fn-overlay {
    top: var(--header-height, 86px);
  }

  .version--gte-2_1_0 #fn-overlay {
    height: auto;
    width: auto;
    padding-top: 0;
  }

  .version--gte-2_1_0 #fn-content {
    min-height: 100vh;
    padding-left: 30px;
    position: absolute;
    box-sizing: border-box;
  }

  .version--gte-2_1_0.header--visible #fn-content {
    min-height: calc(100vh - var(--header-height, 86px));
    top: 0;
  }

  .version--gte-2_1_0 #fn-content-inner {
    padding-bottom: 15rem;
  }

  #fn-back {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  #fn-back-inner {
    padding: 1em 2em 0.35em 2em;
    padding-top: 75px;
    padding-bottom: 75px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .colorscheme--black #fn-back-inner {
    background: linear-gradient(to top, black, black 35%, rgba(0, 0, 0, 0));
  }

  .colorscheme--white #fn-back-inner {
    background: linear-gradient(to top, white, white 33%, rgba(255, 255, 255, 0));
  }

  .colorscheme--sepia #fn-back-inner {
    background: linear-gradient(
      to top,
      var(--ebook-colorscheme-sepia-bg),
      var(--ebook-colorscheme-sepia-bg) 33%,
      rgba(255, 255, 255, 0)
    );
  }

  .colorscheme--black #fn-back #back-to-text {
    background: var(--ebook-colorscheme-black-accent);
  }

  .colorscheme--sepia #fn-back #back-to-text {
    background: var(--ebook-colorscheme-sepia-accent);
  }

  .colorscheme--white #fn-back #back-to-text {
    background: black;
  }

  #fn-back #back-to-text {
    color: white;
    font-weight: 400;
    padding: 0.85em 2em;
    text-transform: uppercase;
    font-family:
      Cabin, 'HelveticaNeue-Light', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    border-radius: 9999px;
  }

  #fn-back p {
    margin: 0.65em 0 0 0;
    font-size: 12px;
    opacity: 0.45;
  }

  .version--gte-2_1_0 #fn-content-inner {
    /* keep footnote content to max-w 50ch for readability */
    padding-left: calc((100vw - 50ch) / 2);
    padding-right: calc((100vw - 50ch) / 2);
  }

  /* END new footnote dismissal */
`;
