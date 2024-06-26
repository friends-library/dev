import React, { useContext } from 'react';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import { DismissSearch } from './TopNavSearch';

export interface HitProps {
  hit: {
    objectID: string;
    _highlightResult: string;
    url: string;
  };
}

type GenericHitProps = HitProps & {
  attrFallback: string;
  attrReject: string[];
  titleAttr: string;
  subtitleAttr?: string;
};

const GenericHit: React.FC<GenericHitProps> = ({
  hit,
  attrFallback,
  attrReject,
  titleAttr,
  subtitleAttr,
}) => {
  const dismiss = useContext(DismissSearch);
  const attr = bestHighlightAttr(hit, attrFallback, attrReject);
  const Summary = attr.match(/(^text$|escription$)/) ? Snippet : Highlight;
  return (
    <Link
      key={hit.objectID}
      className="block p-3 border-b border-flgray-200 subtle-focus"
      href={hit.url}
      onClick={dismiss}
    >
      <h5 className="font-sans text-md tracking-wider leading-tight">
        <Highlight hit={hit} attribute={titleAttr} tagName="mark" />
      </h5>
      {subtitleAttr && (
        <h6 className="mb-2 text-flprimary-400 antialiased uppercase text-xs tracking-wider font-sans">
          <Highlight hit={hit} attribute={subtitleAttr} tagName="mark" />
        </h6>
      )}
      <p className="body-text text-sm leading-snug">
        {attr === `bookTitles` && <span>{t`Books`}: </span>}
        {attr === `residences` && <span>{t`Residences`}: </span>}
        <Summary hit={hit} attribute={attr} tagName="mark" />
      </p>
    </Link>
  );
};

export const BookHit: React.FC<HitProps> = ({ hit }) => (
  <GenericHit
    attrFallback="partialDescription"
    attrReject={[`title`, `authorName`]}
    titleAttr="title"
    subtitleAttr="authorName"
    hit={hit}
  />
);

export const PageHit: React.FC<HitProps> = ({ hit }) => (
  <GenericHit
    attrFallback="text"
    attrReject={[`title`, `subtitle`]}
    titleAttr="title"
    subtitleAttr="subtitle"
    hit={hit}
  />
);

export const FriendHit: React.FC<HitProps> = ({ hit }) => (
  <GenericHit
    attrFallback="description"
    attrReject={[`name`]}
    titleAttr="name"
    hit={hit}
  />
);

function bestHighlightAttr(
  hit: Record<string, any>,
  fallback: string,
  reject: string[],
): string {
  for (const attr of Object.keys(hit._highlightResult)) {
    if (hit._highlightResult[attr].matchLevel === `full` && !reject.includes(attr)) {
      return attr;
    }
  }
  return fallback;
}
