import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { bookDims } from '@friends-library/lulu';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import type { EditionType, PrintSize } from '@friends-library/types';
import type { EditionCoverData } from '@/lib/cover';
import DownloadWizard from './DownloadWizard';
import RotatableCover from './RotatableCover';
import DocActions from './DocActions';
import AddToCartWizard from './AddToCartWizard';
import Dual from '@/components/core/Dual';
import { APP_ALT_URL, LANG } from '@/lib/env';
import { makeScroller } from '@/lib/scroll';
import SpanishFreeBooksNote from '@/components/core/SpanishFreeBooksNote';
import { getFriendUrl, getDocumentUrl } from '@/lib/friend';
import CartStore from '@/components/checkout/services/CartStore';
import CartItem from '@/components/checkout/models/CartItem';

export interface Props {
  friendName: string;
  friendSlug: string;
  friendGender: 'male' | 'female' | 'mixed';
  title: string;
  htmlTitle: string;
  htmlShortTitle: string;
  originalTitle?: string;
  isComplete: boolean;
  priceInCents: number;
  description: string;
  hasAudio: boolean;
  numDownloads: number;
  isCompilation: boolean;
  customCss?: string;
  customHtml?: string;
  editions: Array<{
    id: UUID;
    type: EditionType;
    isbn: string;
    printSize: PrintSize;
    numPages: [number, ...number[]];
    loggedDownloadUrls: {
      pdf: string;
      epub: string;
      mobi: string;
      speech: string;
    };
  }>;
  alternateLanguageDoc?: {
    friendSlug: string;
    slug: string;
  };
  primaryEdition: EditionCoverData & {
    numChapters: number;
  };
}

const DocBlock: React.FC<Props> = (props) => {
  const wrap = useRef<HTMLDivElement | null>(null);
  const store = CartStore.getSingleton();
  const [downloading, setDownloading] = useState<boolean>(false);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [wizardOffset, setWizardOffset] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const positionWizard: () => void = () => {
    if (!wrap.current || (!downloading && !addingToCart)) {
      return;
    }
    // i should lose my React license for this
    let visibleBtnRect: DOMRect | undefined;
    document.querySelectorAll(`.DocBlock .MultiPill > button`).forEach((btn) => {
      const rect = btn.getBoundingClientRect();
      if (!rect.width && !rect.height) {
        return;
      }
      const text = (btn.textContent || ``).toLowerCase();
      if (
        (downloading && text.match(/download|descargar/)) ||
        (addingToCart && text.includes(`.`))
      ) {
        visibleBtnRect = rect;
      }
    });

    if (!visibleBtnRect) {
      return;
    }

    const wrapRect = wrap.current.getBoundingClientRect();
    const top = visibleBtnRect.top - wrapRect.top + visibleBtnRect.height + 16;
    const left = visibleBtnRect.x + visibleBtnRect.width / 2;
    setWizardOffset({ top, left });
    setTimeout(ensureWizardInViewport, 0);
  };

  useEffect(positionWizard, [downloading, addingToCart]);

  useEffect(() => {
    window.addEventListener(`resize`, positionWizard);
    return () => window.removeEventListener(`resize`, positionWizard);
  }, [downloading, addingToCart]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const escape: (e: KeyboardEvent) => void = ({ keyCode }) => {
      if (keyCode === 27 && (downloading || addingToCart)) {
        setDownloading(false);
        setAddingToCart(false);
      }
    };
    document.addEventListener(`keydown`, escape);
    return () => window.removeEventListener(`keydown`, escape);
  }, [downloading, addingToCart]);

  const addToCart = (editionType: EditionType): void => {
    const edition = props.editions.find((e) => e.type === editionType);
    if (!edition) throw new Error(`Error selecting edition: ${editionType}`);
    store.cart.addItem(
      new CartItem({
        displayTitle: props.htmlShortTitle,
        title: props.title,
        editionId: edition.id,
        edition: edition.type,
        quantity: 1,
        printSize: edition.printSize,
        numPages: edition.numPages,
        author: props.friendName,
        isbn: edition.isbn,
        isCompilation: props.isCompilation,
        customHtml: props.customHtml,
        customCss: props.customCss,
      }),
    );
  };

  const clickHandlers = {
    onClickAddToCart: () => {
      if (props.editions.length === 1) {
        return addToCart(props.editions[0]?.type ?? `updated`);
      }
      setAddingToCart(!addingToCart);
      setDownloading(false);
    },
    onClickDownload: () => {
      setDownloading(!downloading);
      setAddingToCart(false);
    },
  };

  return (
    <section
      ref={wrap}
      className={cx(
        `DocBlock [background-image:linear-gradient(transparent_0%,transparent_105px,rgb(240,240,240)_105px,rgb(240,240,240)_375px,transparent_375px)] [&_a:link]:cursor-pointer relative bg-white pt-8 pb-12 px-10 md:px-12 lg:pb-24 xl:flex xl:flex-col xl:items-center`,
        `md:[&_ul]:w-full md:[&_ul]:py-0 md:[&_ul]:px-[5em] md:[&_ul]:[column-count:3] md:[&_ul]:[column-width:20vw] md:[&_ul]:[column-gap:20px] md:[&_li]:[break-inside:avoid-column]`,
        `xl:[background-image:linear-gradient(transparent_0%,transparent_105px,rgb(240,240,240)_105px,rgb(240, 240, 240)_510px,transparent_510px)] xl:[&_ul]:[padding:0_0_0_1.5em] xl:[&_ul]:[column-width:10vw]`,
      )}
    >
      {addingToCart && (
        <AddToCartWizard
          {...wizardOffset}
          editions={props.editions.map((e) => e.type)}
          onSelect={(editionType) => {
            addToCart(editionType);
            setAddingToCart(false);
            setWizardOffset({ top: -9999, left: -9999 });
          }}
        />
      )}
      {downloading && (
        <DownloadWizard
          {...wizardOffset}
          onSelect={(editionType, format) => {
            const edition = props.editions.find((e) => e.type === editionType);
            if (edition) {
              setTimeout(() => {
                setDownloading(false);
                setWizardOffset({ top: -9999, left: -9999 });
              }, 4000);
              const referer = `${window.location.origin}${window.location.pathname}`;
              window.location.href = `${edition.loggedDownloadUrls[format]}?referer=${referer}`;
            }
          }}
          editions={props.editions.map((e) => e.type)}
        />
      )}
      <div className="xl:max-w-[80rem] md:flex">
        <RotatableCover
          className="order-1"
          coverData={{ ...props, ...props.primaryEdition }}
        />
        <div className="mb-8 md:px-12 bg-white md:mr-6 xl:mr-10">
          <h1
            className="font-sans text-3xl md:text-2-5xl font-bold leading-snug mt-8 tracking-wider mb-6"
            dangerouslySetInnerHTML={{ __html: titleHtml(props) }}
          />
          {!props.isCompilation && (
            <h2 className="font-sans text-1-5xl md:text-xl subpixel-antialiased leading-loose mb-8">
              <i className="font-serif tracking-widest pr-1">{t`by`}:</i>
              {` `}
              <Link
                className="strong-link"
                href={getFriendUrl(props.friendSlug, props.friendGender)}
              >
                {props.friendName}
              </Link>
            </h2>
          )}
          {!props.isComplete && (
            <Dual.P className="font-serif text-xl md:text-lg antialiased italic leading-relaxed mb-4 text-flprimary-800">
              <>
                <sup>*</sup>
                This book is not yet completely published. Since individual chapters are
                valuable on their own, they will be made available as they are completed.
              </>
              <>
                <sup>*</sup>
                Este libro aún está siendo traducido, sin embargo, dado que cada capítulo
                es muy valioso, estarán disponibles a medida que se vayan completando.
              </>
            </Dual.P>
          )}
          <p
            className="font-serif text-xl md:text-lg antialiased leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: props.originalTitle
                ? `${props.description} (${t`Original title`}: <em>${
                    props.originalTitle
                  }</em>)`
                : props.description,
            }}
          />
          <LinksAndMeta
            className="hidden xl:block xl:mt-10"
            {...clickHandlers}
            {...props}
          />
        </div>
      </div>
      <LinksAndMeta className="xl:hidden mt-6" {...clickHandlers} {...props} />
    </section>
  );
};

export default DocBlock;

type LinksAndMetaProps = Props & {
  className: string;
  onClickDownload(): unknown;
  onClickAddToCart(): unknown;
};

const LinksAndMeta: React.FC<LinksAndMetaProps> = (props) => (
  <div className={props.className}>
    <DocActions
      download={props.onClickDownload}
      addToCart={props.onClickAddToCart}
      gotoAudio={makeScroller(`#audiobook`)}
      className="mb-8 flex flex-col md:flex-row items-center md:items-start lg:mx-24 xl:mx-0"
      price={props.priceInCents}
      hasAudio={props.hasAudio}
    />
    <div className="DocMeta flex flex-col items-center">
      <ul className="diamonds text-sans text-gray-600 leading-loose antialiased">
        <li>{props.friendName}</li>
        {LANG === `en` && (
          <li className="capitalize">{props.primaryEdition.editionType} Edition</li>
        )}
        <li>
          {dimensions(
            props.primaryEdition.printSize,
            props.primaryEdition.paperbackVolumes,
          )}
        </li>
        <li>
          {props.primaryEdition.numChapters > 1
            ? t`${props.primaryEdition.numChapters} chapters`
            : t`1 chapter`}
        </li>
        <li>
          {props.primaryEdition.paperbackVolumes.map((p) => t`${p} pages`).join(`, `)}
        </li>
        {props.numDownloads > 10 && (
          <li>
            <Dual.Frag>
              <>{props.numDownloads.toLocaleString()} downloads</>
              <>{props.numDownloads.toLocaleString().replace(/,/g, `.`)} descargas</>
            </Dual.Frag>
          </li>
        )}
        <li>
          <Dual.Frag>
            <>Language: English</>
            <>Idioma: Español</>
          </Dual.Frag>
        </li>
        {props.alternateLanguageDoc && (
          <li>
            <Dual.A
              className="border-b border-dashed border-current"
              href={`${APP_ALT_URL}/${getDocumentUrl(props.alternateLanguageDoc)}`}
            >
              <>Spanish Version</>
              <>Versión en inglés</>
            </Dual.A>
          </li>
        )}
      </ul>
    </div>
    <SpanishFreeBooksNote
      bookTitle={`${props.htmlShortTitle} — ${props.friendName}`}
      className="body-text mt-8 md:mt-10 sm:px-8 md:px-16 mx-auto max-w-screen-md opacity-75"
    />
  </div>
);

function dimensions(size: PrintSize, pages: number[]): string {
  return (
    pages
      .map((p) => bookDims(size, p))
      .map((dims) =>
        [dims.width, dims.height, dims.depth]
          .map((n) => (LANG === `en` ? n : n * CENTIMETERS_IN_INCH))
          .map((n) => n.toPrecision(2))
          .map((s) => s.replace(/\.0+$/, ``))
          .join(` x `),
      )
      .join(`, `) + `${LANG === `en` ? ` in` : ` cm`}`
  );
}

function ensureWizardInViewport(): void {
  const wizard = document.querySelector(`.ChoiceWizard`);
  if (!wizard) {
    return;
  }

  const { bottom } = wizard.getBoundingClientRect();
  if (bottom > window.innerHeight) {
    const extraSpace = 25;
    const scrollTo = bottom - window.innerHeight + window.scrollY + extraSpace;
    window.scrollTo({ top: scrollTo, behavior: `smooth` });
  }
}

function titleHtml({ htmlTitle, isComplete }: Props): string {
  let html = htmlTitle;
  if (!isComplete) {
    html += `<sup class="text-flprimary-800">*</sup>`;
  }
  return html;
}

const CENTIMETERS_IN_INCH = 2.54;
