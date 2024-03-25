import React from 'react';
import cx from 'classnames';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { type Api } from '@/lib/ssg/api-client';
import { LANG } from '@/lib/env';
import AudioPlayer from '@/components/core/AudioPlayer';

type HtmlComponent<T> = {
  (props: DetailedHTMLProps<HTMLAttributes<T>, T>): React.JSX.Element;
};

export const MdxH2: HtmlComponent<HTMLHeadingElement> = (props) => (
  <h2
    className={cx(
      `bg-flprimary text-white font-sans text-2xl bracketed tracking-widest`,
      `my-12 -mx-10 py-4 px-10`,
      `sm:text-3xl`,
      `md:-mx-16 md:px-16 `,
      `lg:-mx-24 lg:px-24`,
    )}
    {...props}
  >
    {props.children}
  </h2>
);

export const MdxP: HtmlComponent<HTMLParagraphElement> = (props) => (
  <p
    className="mb-6 pb-1 last:mb-0 last:pb-0 text-base sm:text-lg leading-loose"
    {...props}
  >
    {props.children}
  </p>
);

export const MdxLi: HtmlComponent<HTMLLIElement> = (props) => (
  <li className="py-2" {...props}>
    {props.children}
  </li>
);

export const MdxH3: HtmlComponent<HTMLHeadingElement> = (props) => (
  <h3 className="font-sans text-flprimary mb-2 text-2xl" {...props}>
    {props.children}
  </h3>
);

export const MdxA: HtmlComponent<HTMLAnchorElement> = (props) => (
  <a className="text-flprimary fl-underline" {...props}>
    {props.children}
  </a>
);

export const MdxBlockquote: HtmlComponent<HTMLQuoteElement> = (props) => (
  <blockquote
    className={cx(`italic tracking-wider bg-flgray-100 leading-loose`, `py-4 px-8 my-8`)}
    {...props}
  >
    {props.children}
  </blockquote>
);

export const MdxUl: HtmlComponent<HTMLUListElement> = (props) => (
  <ul
    className={cx(
      `diamonds leading-normal bg-flgray-100 text-base sm:text-lg`,
      `py-4 px-16 mb-8`,
    )}
    {...props}
  >
    {props.children}
  </ul>
);

export const MdxLead: (p: { children: React.ReactNode }) => React.JSX.Element = ({
  children,
}) => (
  <div className="text-xl pb-4 pt-2 leading-relaxed sm:!text-2xl sm:!leading-relaxed [&>p]:text-xl [&>p]:pb-4 [&>p]:pt-2 [&>p]:leading-relaxed [&>p]:sm:!text-2xl [&_a]:text-flprimary [&_a]:border-b-2 [&_a]:border-flprimary [&_a]:pb-0.5 [&_a:hover]:pb-0 [&_a]:transition-[padding-bottom] duration-200">
    {children}
  </div>
);

export const components = {
  h2: MdxH2,
  p: MdxP,
  li: MdxLi,
  h3: MdxH3,
  a: MdxA,
  blockquote: MdxBlockquote,
  ul: MdxUl,
  Lead: MdxLead,
  AudioPlayer,
};

export function replacePlaceholders(
  content: string,
  totalPublished: Api.TotalPublished.Output,
): string {
  return content
    .replace(/%NUM_AUDIOBOOKS%/g, String(totalPublished.audiobooks[LANG]))
    .replace(/%NUM_SPANISH_BOOKS%/g, String(totalPublished.books.es))
    .replace(/%NUM_ENGLISH_BOOKS%/g, String(totalPublished.books.en))
    .replace(/ -- /g, ` — `);
}
