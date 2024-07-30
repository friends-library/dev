import css from 'x-syntax';

export default css`
  h2,
  h3,
  h4,
  h5 {
    line-height: 1.5em;
  }

  h2 {
    text-align: center;
  }

  .heading-segment {
    display: block;
    line-height: 1.5em;
  }

  .chapter-heading .heading-segment--2 {
    font-size: 0.9em;
  }

  .chapter-heading .heading-segment--3 {
    font-size: 0.8em;
  }

  .chapter-heading__sequence {
    font-weight: 400;
  }

  .chapter-heading__title {
    text-align: center;
    font-weight: 700;
  }

  .style-blurb .chapter-heading h2 {
    font-weight: normal;
    font-style: italic;
    text-transform: none;
  }

  .chapter-subtitle--blurb {
    font-weight: normal;
    font-style: italic;
    text-transform: none;
    text-align: center;
    margin: -1em 0 2.25em;
  }

  h3 + h4 {
    margin-top: 0;
  }

  .epigraphs {
    margin-top: 30%;
    text-align: center;
    page: epigraphs;
  }

  .epigraph__text::before {
    content: '“';
  }

  .epigraph__text::after {
    content: '”';
    margin-left: -0.25em;
  }

  @page epigraphs {
    @bottom-center {
      content: normal;
    }
  }

  .epigraph {
    font-style: italic;
  }

  .epigraph__source {
    font-size: 0.9em;
    white-space: nowrap;
  }

  .epigraph__source::before {
    content: '(';
  }

  .epigraph__source::after {
    content: ')';
  }

  .epigraph--not-first::before {
    content: '*\\00a0\\00a0\\00a0\\00a0\\00a0*\\00a0\\00a0\\00a0\\00a0\\00a0*';
    margin-top: 2.5em;
    padding-bottom: 2em;
    display: block;
  }

  .poetry {
    display: block;
    margin-top: 1em;
    margin-bottom: 1em;
    font-style: italic;
    text-align: center;
    font-size: 95%;
  }

  .verse-stanza {
    display: block;
  }

  .verse-stanza + .verse-stanza {
    margin-top: 1.4em;
  }

  .verse-line {
    display: block;
    line-height: 1.6em;
  }

  .letter-heading {
    margin: 2.6em 0 0.6em;
    text-transform: uppercase;
    font-size: 0.85em;
    font-weight: 700;
    text-align: center;
    text-indent: 0;
  }

  /* technically not necessary :) */
  .no-indent {
    text-indent: 0;
    text-align: justify;
  }

  /* blockquotes */
  figcaption > *:first-child::before {
    content: '\\2014';
  }

  /* chicago manual of style says first para of blockquote should not be indented */
  blockquote .paragraph:first-of-type {
    text-indent: 0;
  }

  blockquote.scripture p {
    font-style: italic;
  }

  figure.attributed-quote {
    margin: 0;
  }

  figure.attributed-quote figcaption cite {
    display: block;
  }

  h3.blurb,
  h4.blurb,
  p.blurb {
    font-weight: 400;
    font-style: italic;
    text-align: center;
  }

  /* emphasis within emphasis */
  .style-blurb .chapter-heading .book-title,
  blockquote.scripture em,
  .blurb .book-title,
  .emphasized .book-title,
  .syllogism em,
  .emphasized em,
  .blurb em,
  .emphasized em,
  .section-author em,
  .section-summary-preface .book-title,
  .section-author-context .book-title,
  .heading-continuation-blurb .book-title,
  .section-summary-preface em,
  .section-author-context em,
  .heading-continuation-blurb em {
    font-variant: small-caps;
    font-style: normal;
    font-size: 1.07em;
    padding-left: 0.1em;
    hyphens: none !important;
  }

  .chapter-synopsis {
    list-style: none;
    font-style: italic;
    text-align: center;
    font-size: 0.85em;
    padding: 0;
    margin: 0 1.5em 2em 1.5em;
  }

  .chapter-synopsis li {
    display: inline;
  }

  .chapter-synopsis li + li::before {
    content: '\\2014';
    display: inline-block;
  }

  .offset,
  .paragraph.offset {
    text-indent: 0;
    margin-top: 1em;
    margin-bottom: 1em;
    text-align: justify;
  }

  .numbered p:first-child {
    margin-bottom: 0;
    margin-top: 1em;
    text-indent: 0;
  }

  .numbered-group {
    margin-bottom: 1em;
  }

  .discourse-part {
    margin-bottom: 0;
    text-align: justify;
  }

  .small-break {
    height: 1em;
  }

  .the-end {
    text-transform: uppercase;
    margin-top: 3em;
    text-align: center;
  }

  .old-style {
    margin-top: 2.75em;
    text-align: center;
  }

  .old-style .heading-segment--1 {
    margin-bottom: 0.5em;
  }

  .old-style .heading-segment {
    display: block;
    line-height: 1.5em;
  }

  .old-style .heading-segment + .heading-segment {
    font-weight: 400;
    font-style: italic;
  }

  .old-style.bold .heading-segment + .heading-segment {
    font-weight: 700;
    font-style: normal;
  }

  .old-style.bold .heading-segment + .heading-segment em {
    font-style: normal;
  }

  h3.alt,
  h4.alt {
    font-weight: 400;
    font-style: italic;
  }

  .centered {
    text-align: center !important;
    text-indent: 0 !important;
  }

  .emphasized {
    font-style: italic;
  }

  .weight-normal {
    font-weight: 400;
  }

  .small-caps {
    font-variant: small-caps;
  }

  /* definition lists */
  dl {
    margin-top: 1.5em;
  }

  dd {
    margin: 1em 0 1em 2.85em;
    text-align: justify;
  }

  dt {
    font-weight: 700;
  }
  /* END definition lists */

  .embedded-content-document {
    margin: 1.35em 0 1.35em;
  }

  .half-title-page .editor {
    font-style: italic;
    text-align: center;
    font-size: 0.65em;
  }

  .book-title {
    font-style: italic;
  }

  .underline {
    text-decoration: underline;
  }

  .syllogism {
    padding-left: 0;
    margin-left: 2.5em;
  }

  .syllogism li {
    font-style: italic;
    margin: 1em 0;
  }

  .heading-continuation-blurb,
  .section-summary-preface {
    font-style: italic;
    padding-left: 1.5em;
    text-indent: -1.5em;
    text-align: justify;
  }

  .heading-continuation-blurb {
    margin-bottom: 1.75em;
    font-size: 0.95em;
  }

  .section-summary-preface {
    margin-bottom: 1em;
  }

  .heading-continuation-blurb + .heading-continuation-blurb {
    margin-top: -0.75em;
  }

  .section-author,
  .section-author-context {
    font-style: italic;
    text-align: center !important;
    text-indent: 0 !important;
  }

  .section-author-context {
    margin-top: 0.65em;
    margin-bottom: 1.75em;
    font-size: 90%;
  }

  .section-author + .heading-continuation-blurb,
  .section-author-context + .heading-continuation-blurb {
    margin-top: 1.5em;
  }

  .section-date {
    margin: 1.5em 0;
    text-align: center !important;
    text-indent: 0 !important;
  }

  .section-date::before {
    content: '[';
    font-style: italic;
    padding-right: 0.1em;
  }

  .section-date::after {
    content: ']';
    font-style: italic;
    margin-left: -0.2em;
  }

  blockquote.section-epigraph {
    margin-left: 1.5em;
    margin-right: 1.5em;
    border-left-width: 0;
  }

  blockquote.section-epigraph .paragraph {
    font-size: 0.9em;
    padding-left: 0;
  }

  h3.inline,
  h4.inline,
  h5.inline {
    padding-left: 1.5em;
    font-size: 1em;
    text-indent: -1.5em;
    margin: 1.333em 0;
    text-align: justify;
  }

  h3.inline em,
  h4.inline em,
  h5.inline em {
    font-variant: small-caps;
    font-style: normal;
    font-size: 1.07em;
    hyphens: none !important;
  }

  .footnote-paragraph + .footnote-paragraph {
    display: block;
    margin-top: 0.5em;
  }

  .footnote .poetry {
    margin-top: 0.4em;
    margin-bottom: 0.4em;
  }

  .footnote .verse-stanza {
    margin-bottom: 0;
  }

  .footnote .verse-stanza + .verse-stanza {
    margin-top: 0.45em;
  }

  .footnote .verse-line {
    line-height: 1.2em;
  }

  h3 + .letter-heading {
    margin-top: 1em;
  }

  h3 + h4 {
    margin-top: -0.75em;
  }

  h3 + h4.old-style {
    margin-top: 0.75em;
  }

  h3 + h3,
  h4 + h4 {
    margin-top: -0.5em;
  }
`;
