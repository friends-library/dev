import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import React from 'react';
import type { Metadata, NextPage } from 'next';
import type { MdxPageFrontmatter, Params } from '@/lib/types';
import invariant from '@/lib/invariant';
import { replacePlaceholders, components } from '@/components/mdx';
import WhiteOverlay from '@/components/core/WhiteOverlay';
import api from '@/lib/ssg/api-client';
import * as mdx from '@/lib/mdx';
import { LANG } from '@/lib/env';
import * as seo from '@/lib/seo';
import BooksBgBlock from '@/components/core/BooksBgBlock';

interface PageData {
  source: string;
  frontmatter: MdxPageFrontmatter;
}

type Path = { static: string };

export async function generateStaticParams(): Promise<Path[]> {
  return mdx
    .fileData()
    .filter((file) => file.lang === LANG)
    .map(({ slug }) => ({ static: slug }));
}

async function getPageData(slug: string): Promise<PageData> {
  const totals = await api.totalPublished();
  const source = replacePlaceholders(mdx.source(slug, LANG), totals);
  const { content, data: frontmatter } = matter(source);
  invariant(mdx.verifyFrontmatter(frontmatter), `invalid frontmatter`);
  frontmatter.description = replacePlaceholders(frontmatter.description, totals);
  return { source: content, frontmatter };
}

const Page: NextPage<Params<Path>> = async (props) => {
  const { source, frontmatter } = await getPageData(props.params.static);
  return (
    <div>
      <BooksBgBlock>
        <WhiteOverlay>
          <h1 className="heading-text text-2xl sm:text-4xl bracketed text-flprimary">
            {frontmatter.title}
          </h1>
        </WhiteOverlay>
      </BooksBgBlock>
      <div className="MDX p-10 md:px-16 md:pb-16 lg:px-24 body-text max-w-6xl mx-auto mt-4">
        <MDXRemote source={source} components={components} />
      </div>
    </div>
  );
};

export default Page;

export async function generateMetadata({ params }: Params<Path>): Promise<Metadata> {
  const { frontmatter } = await getPageData(params.static);
  return seo.nextMetadata(frontmatter.title, frontmatter.description);
}

export const revalidate = 10800; // 3 hours
export const dynamicParams = false;
