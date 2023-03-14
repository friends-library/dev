import React from 'react';
import { graphql } from 'gatsby';
import { t } from '@friends-library/locale';
import { Layout, Seo } from '../components/data';
import BooksBgBlock, { WhiteOverlay } from '../components/data/BooksBgBlock';
import ExploreNavBlock from '../components/pages/explore/NavBlock';
import ExploreRegionBlock from '../components/pages/explore/RegionBlock';
import ExploreSearchBlock from '../components/pages/explore/SearchBlock';
import ExploreAltSiteBlock from '../components/pages/explore/AltSiteBlock';
import ExploreNewBooksBlock from '../components/pages/explore/NewBooksBlock';
import ExploreTimelineBlock from '../components/pages/explore/TimelineBlock';
import ExploreAudioBooksBlock from '../components/pages/explore/AudioBooksBlock';
import ExploreUpdatedEditionsBlock from '../components/pages/explore/UpdatedEditionsBlock';
import ExploreGettingStartedLinkBlock from '../components/pages/explore/GettingStartedLinkBlock';
import { PAGE_META_DESCS } from '../lib/seo';
import { coverPropsFromQueryData, CoverData } from '../lib/covers';
import { APP_ALT_URL, LANG } from '../env';
import Dual from '../components/Dual';
import { FluidBgImageObject, NumPublishedBooks } from '../types';
import { Region } from '../components/pages/explore/types';

const ExplorePage: React.FC<Props> = ({
  data: {
    numPublished,
    updatedEditions,
    audioBooks,
    newBooks,
    booksByDate,
    regionBooks,
    searchBooks,
    headphones,
    books3,
    waterPath,
    castle,
  },
}) => {
  audioBooks.nodes.sort((a, b) =>
    (a.ed[0]?.audio?.added ?? ``) < (b.ed[0]?.audio?.added ?? ``) ? 1 : -1,
  );
  regionBooks.nodes.sort((a, b) => (a.authorName < b.authorName ? -1 : 1));
  return (
    <Layout>
      <Seo
        title={t`Explore Books`}
        // prettier-ignore
        description={PAGE_META_DESCS.explore[LANG]
            .replace(/%NUM_ENGLISH_BOOKS%/g, `${numPublished.books.en}`)
            .replace(/%NUM_UPDATED_EDITIONS%/g, `${updatedEditions.nodes.length}`)
            .replace(/%NUM_SPANISH_BOOKS%/g, `${numPublished.books.es}`)
            .replace(/%NUM_AUDIOBOOKS%/g, `${audioBooks.nodes.length}`)}
      />
      <BooksBgBlock bright>
        <WhiteOverlay>
          <Dual.H1 className="sans-wider text-3xl mb-6">
            <>Explore Books</>
            <>Explorar Libros</>
          </Dual.H1>
          <Dual.P className="body-text">
            <>
              We currently have {numPublished.books.en} books freely available on this
              site. Overwhelmed? On this page you can browse all the titles by edition,
              region, time period, tags, and more&mdash;or search the full library to find
              exactly what you’re looking for.
            </>
            <>
              Actualmente tenemos {numPublished.books.es} libros disponibles de forma
              gratuita en este sitio, y más están siendo traducidos y añadidos
              regularmente. En nuestra página de “Explorar” puedes navegar por todos
              nuestros libros y audiolibros, o buscar libros en la categoría particular
              que más te interese.
            </>
          </Dual.P>
        </WhiteOverlay>
      </BooksBgBlock>
      <ExploreNavBlock />
      <ExploreUpdatedEditionsBlock
        books={updatedEditions.nodes.map((data) => ({
          ...coverPropsFromQueryData(data),
          htmlShortTitle: data.htmlShortTitle,
          documentUrl: data.documentUrl,
          authorUrl: data.authorUrl,
        }))}
      />
      <ExploreGettingStartedLinkBlock bgImg={books3.image.fluid} />
      <ExploreAudioBooksBlock
        bgImg={headphones.image.fluid}
        books={audioBooks.nodes.map((data) => ({
          ...coverPropsFromQueryData(data),
          htmlShortTitle: data.htmlShortTitle,
          documentUrl: data.documentUrl,
        }))}
      />
      <ExploreNewBooksBlock
        books={newBooks.nodes.slice(0, LANG === `es` ? 2 : 4).map((data) => ({
          ...coverPropsFromQueryData(data),
          documentUrl: data.documentUrl,
          htmlShortTitle: data.htmlShortTitle,
          authorUrl: data.authorUrl,
          badgeText: data.editions[0].badgeText,
          description:
            data.description ||
            `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.`,
        }))}
      />
      {LANG === `en` && (
        <ExploreRegionBlock
          books={regionBooks.nodes.map((data) => ({
            ...coverPropsFromQueryData(data),
            htmlShortTitle: data.htmlShortTitle,
            region: data.region as Region,
            documentUrl: data.documentUrl,
            authorUrl: data.authorUrl,
          }))}
        />
      )}
      {LANG === `en` && (
        <ExploreTimelineBlock
          bgImg={castle.image.fluid}
          books={booksByDate.nodes.map((data) => ({
            ...coverPropsFromQueryData(data),
            htmlShortTitle: data.htmlShortTitle,
            date: data.date,
            documentUrl: data.documentUrl,
            authorUrl: data.authorUrl,
          }))}
        />
      )}
      <ExploreAltSiteBlock
        url={APP_ALT_URL}
        numBooks={numPublished.books[LANG === `en` ? `es` : `en`]}
      />
      <ExploreSearchBlock
        bgImg={waterPath.image.fluid}
        books={searchBooks.nodes.flatMap((data) =>
          data.editions.map((edition) => ({
            ...coverPropsFromQueryData({ ...data, editions: [edition] }),
            htmlShortTitle: data.htmlShortTitle,
            tags: data.tags,
            period: data.period as any,
            region: data.region as any,
            documentUrl: data.documentUrl,
            authorUrl: data.authorUrl,
          })),
        )}
      />
    </Layout>
  );
};

interface Props {
  data: NumPublishedBooks & {
    searchBooks: {
      nodes: (CoverData & {
        documentUrl: string;
        htmlShortTitle: string;
        authorUrl: string;
        tags: string[];
        period: string;
        region: string;
      })[];
    };
    newBooks: {
      nodes: (CoverData & {
        documentUrl: string;
        htmlShortTitle: string;
        authorUrl: string;
        editions: {
          badgeText: string;
        }[];
        description?: string;
      })[];
    };
    audioBooks: {
      nodes: (CoverData & {
        documentUrl: string;
        htmlShortTitle: string;
        ed: Array<{ audio: null | { added: string } }>;
      })[];
    };
    regionBooks: {
      nodes: (CoverData & {
        authorUrl: string;
        authorName: string;
        documentUrl: string;
        region: string;
        htmlShortTitle: string;
      })[];
    };
    updatedEditions: {
      nodes: (CoverData & {
        documentUrl: string;
        authorUrl: string;
        htmlShortTitle: string;
      })[];
    };
    booksByDate: {
      nodes: (CoverData & {
        documentUrl: string;
        authorUrl: string;
        date: number;
        htmlShortTitle: string;
      })[];
    };
    books3: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
    waterPath: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
    castle: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
    headphones: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
  };
}

export const query = graphql`
  query ExplorePage {
    numPublished: publishedCounts {
      ...PublishedBooks
    }
    searchBooks: allDocument {
      nodes {
        ...CoverProps
        period
        authorUrl
        documentUrl: url
        htmlShortTitle
        region
        tags
      }
    }
    regionBooks: allDocument(filter: { region: { ne: "Other" } }) {
      nodes {
        ...CoverProps
        documentUrl: url
        htmlShortTitle
        authorUrl
        authorName
        region
      }
    }
    booksByDate: allDocument {
      nodes {
        ...CoverProps
        authorUrl
        documentUrl: url
        htmlShortTitle
        date
      }
    }
    newBooks: allDocument(
      sort: { fields: editions___publishedTimestamp, order: DESC }
      limit: 4
    ) {
      nodes {
        ...CoverProps
        editions {
          badgeText: publishedDate
        }
        description: partialDescription
        authorUrl
        documentUrl: url
        htmlShortTitle
      }
    }
    audioBooks: allDocument(filter: { hasAudio: { eq: true } }) {
      nodes {
        ...CoverProps
        documentUrl: url
        htmlShortTitle
        ed: editions {
          audio {
            added
          }
        }
      }
    }
    updatedEditions: allDocument(
      filter: { editions: { elemMatch: { type: { eq: "updated" } } } }
    ) {
      nodes {
        ...CoverProps
        authorUrl
        documentUrl: url
        htmlShortTitle
      }
    }
    books3: file(relativePath: { eq: "Books3.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    waterPath: file(relativePath: { eq: "water-path.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    castle: file(relativePath: { eq: "castle.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    headphones: file(relativePath: { eq: "headphones.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;

export default ExplorePage;
