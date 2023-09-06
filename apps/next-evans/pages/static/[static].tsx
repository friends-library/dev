import matter from 'gray-matter';
import cx from 'classnames';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import invariant from 'tiny-invariant';
import { type MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { MdxPageFrontmatter } from '@/lib/types';
import { WhiteOverlay } from '../explore';
import HeroImg from '@/public/images/explore-books.jpg';
import * as mdx from '@/lib/mdx';
import { LANG } from '@/lib/env';
import BackgroundImage from '@/components/core/BackgroundImage';
import { getAllDocuments } from '@/lib/db/documents';
import Seo from '@/components/core/Seo';

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

  const englishBooks = Object.values(await getAllDocuments(`en`));
  const spanishBooks = Object.values(await getAllDocuments(`es`));
  const numAudiobooks =
    LANG === `en`
      ? englishBooks.filter((book) => book.hasAudio).length
      : spanishBooks.filter((book) => book.hasAudio).length;

  const source = replacePlaceholders(
    mdx.source(slug, LANG),
    englishBooks.length,
    spanishBooks.length,
    numAudiobooks,
  );

  const { content, data: frontmatter } = matter(source);
  invariant(mdx.verifyFrontmatter(frontmatter));
  frontmatter.description = replacePlaceholders(
    frontmatter.description,
    englishBooks.length,
    spanishBooks.length,
    numAudiobooks,
  );
  const mdxSource = await serialize(content, { scope: frontmatter });

  return {
    props: {
      source: mdxSource,
      frontmatter,
    },
  };
};

const components: React.ComponentProps<typeof MDXRemote>['components'] = {
  h2: ({ children }) => (
    <h2
      className={cx(
        `bg-flprimary text-white font-sans text-2xl bracketed tracking-widest`,
        `my-12 -mx-10 py-4 px-10`,
        `sm:text-3xl`,
        `md:-mx-16 md:px-16 `,
        `lg:-mx-24 lg:px-24`,
      )}
    >
      {children}
    </h2>
  ),

  p: ({ children }) => (
    <p className="mb-6 pb-1 text-base sm:text-lg leading-loose">{children}</p>
  ),

  li: ({ children }) => <li className="py-2">{children}</li>,

  h3: ({ children }) => (
    <h3 className="font-sans text-flprimary mb-2 text-2xl">{children}</h3>
  ),

  a: (props) => (
    <a className="text-flprimary fl-underline" {...props}>
      {props.children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote
      className={cx(
        `italic tracking-wider bg-flgray-100 leading-loose`,
        `py-4 px-8 my-8`,
      )}
    >
      {children}
    </blockquote>
  ),

  ul: ({ children }) => (
    <ul
      className={cx(
        `diamonds leading-normal bg-flgray-100 text-base sm:text-lg`,
        `py-4 px-16 mb-8`,
      )}
    >
      {children}
    </ul>
  ),

  Lead: ({ children }) => (
    <div className="text-xl pb-4 pt-2 leading-loose sm:!text-2xl [&>p]:text-xl [&>p]:pb-4 [&>p]:pt-2 [&>p]:leading-loose [&>p]:sm:!text-2xl [&_a]:text-flprimary [&_a]:border-b-2 [&_a]:border-flprimary [&_a]:pb-0.5 [&_a:hover]:pb-0 [&_a]:transition-[padding-bottom] duration-200">
      {children}
    </div>
  ),
};

interface Props {
  source: MDXRemoteSerializeResult;
  frontmatter: MdxPageFrontmatter;
}

const StaticPage: React.FC<Props> = ({ source, frontmatter }) => (
  <>
    <Seo
      title={frontmatter.title}
      documentPage={false}
      description={frontmatter.description}
    />
    <div>
      <BackgroundImage src={HeroImg} fineTuneImageStyles={{ objectFit: `cover` }}>
        <div className="p-8 sm:p-16 lg:p-24 bg-black/60 lg:backdrop-blur-sm">
          <WhiteOverlay>
            <h1 className="heading-text text-2xl sm:text-4xl bracketed text-flprimary">
              {frontmatter.title}
            </h1>
          </WhiteOverlay>
        </div>
      </BackgroundImage>
      <div className="MDX p-10 md:px-16 lg:px-24 body-text max-w-6xl mx-auto mt-4">
        <MDXRemote {...source} components={components} />
      </div>
    </div>
  </>
);

export default StaticPage;

function replacePlaceholders(
  content: string,
  numEnglishBooks: number,
  numSpanishBooks: number,
  numAudiobooks: number,
): string {
  return content
    .replace(/%NUM_AUDIOBOOKS%/g, String(numAudiobooks))
    .replace(/%NUM_SPANISH_BOOKS%/g, String(numSpanishBooks))
    .replace(/%NUM_ENGLISH_BOOKS%/g, String(numEnglishBooks))
    .replace(/ -- /g, ` — `);
}
