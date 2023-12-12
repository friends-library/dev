import matter from 'gray-matter';
import cx from 'classnames';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import invariant from 'tiny-invariant';
import { type MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { MdxPageFrontmatter } from '@/lib/types';
import { WhiteOverlay } from '../explore';
import api, { type Api } from '@/lib/ssg/api-client';
import * as mdx from '@/lib/mdx';
import { LANG } from '@/lib/env';
import Seo from '@/components/core/Seo';
import BooksBgBlock from '@/components/core/BooksBgBlock';

interface Props {
  source: MDXRemoteSerializeResult;
  frontmatter: MdxPageFrontmatter;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: mdx
    .fileData()
    .filter((file) => file.lang === LANG)
    .map(({ slug }) => ({ params: { static: slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slug = context.params?.static;
  invariant(typeof slug === `string`);
  const totals = await api.totalPublished();
  const source = replacePlaceholders(mdx.source(slug, LANG), totals);
  const { content, data: frontmatter } = matter(source);
  invariant(mdx.verifyFrontmatter(frontmatter));
  frontmatter.description = replacePlaceholders(frontmatter.description, totals);
  const mdxSource = await serialize(content, { scope: frontmatter });

  return {
    props: {
      source: mdxSource,
      frontmatter,
    },
  };
};

type MdxComponent<T = undefined> = T extends HTMLElement
  ? React.FC<DetailedHTMLProps<HTMLAttributes<T>, T>>
  : React.FC<{ children: React.ReactNode }>;

export const MdxH2: MdxComponent<HTMLHeadingElement> = (props) => (
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

export const MdxP: MdxComponent<HTMLParagraphElement> = (props) => (
  <p
    className="mb-6 pb-1 last:mb-0 last:pb-0 text-base sm:text-lg leading-loose"
    {...props}
  >
    {props.children}
  </p>
);

export const MdxLi: MdxComponent<HTMLLIElement> = (props) => (
  <li className="py-2" {...props}>
    {props.children}
  </li>
);

export const MdxH3: MdxComponent<HTMLHeadingElement> = (props) => (
  <h3 className="font-sans text-flprimary mb-2 text-2xl" {...props}>
    {props.children}
  </h3>
);

export const MdxA: MdxComponent<HTMLAnchorElement> = (props) => (
  <a className="text-flprimary fl-underline" {...props}>
    {props.children}
  </a>
);

export const MdxBlockquote: MdxComponent<HTMLQuoteElement> = (props) => (
  <blockquote
    className={cx(`italic tracking-wider bg-flgray-100 leading-loose`, `py-4 px-8 my-8`)}
    {...props}
  >
    {props.children}
  </blockquote>
);

export const MdxUl: MdxComponent<HTMLUListElement> = (props) => (
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

export const MdxLead: MdxComponent = ({ children }) => (
  <div className="text-xl pb-4 pt-2 leading-loose sm:!text-2xl [&>p]:text-xl [&>p]:pb-4 [&>p]:pt-2 [&>p]:leading-loose [&>p]:sm:!text-2xl [&_a]:text-flprimary [&_a]:border-b-2 [&_a]:border-flprimary [&_a]:pb-0.5 [&_a:hover]:pb-0 [&_a]:transition-[padding-bottom] duration-200">
    {children}
  </div>
);

export const components: React.ComponentProps<typeof MDXRemote>['components'] = {
  h2: MdxH2,
  p: MdxP,
  li: MdxLi,
  h3: MdxH3,
  a: MdxA,
  blockquote: MdxBlockquote,
  ul: MdxUl,
  Lead: MdxLead,
};

const StaticPage: React.FC<Props> = ({ source, frontmatter }) => (
  <div>
    <Seo title={frontmatter.title} description={frontmatter.description} />
    <BooksBgBlock>
      <WhiteOverlay>
        <h1 className="heading-text text-2xl sm:text-4xl bracketed text-flprimary">
          {frontmatter.title}
        </h1>
      </WhiteOverlay>
    </BooksBgBlock>
    <div className="MDX p-10 md:px-16 md:pb-16 lg:px-24 body-text max-w-6xl mx-auto mt-4">
      <MDXRemote {...source} components={components} />
    </div>
  </div>
);

export default StaticPage;

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
