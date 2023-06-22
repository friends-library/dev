import React from 'react';
import Link from 'next/link';
import { t } from '@friends-library/locale';
import type { DocumentWithMeta } from '@/lib/types';
import BgWordBlock from './BgWordBlock';
import BookSlider from './BookSlider';
import { LANG } from '@/lib/env';
import Dual from '@/components/core/Dual';

interface Props {
  books: Array<Omit<DocumentWithMeta, 'numPages' | 'size' | 'featuredDescription'>>;
}

const UpdatedEditionsBlock: React.FC<Props> = ({ books }) => (
  <BgWordBlock
    id="UpdatedEditionsBlock"
    className="UpdatedEditionsBlock p-10 flex flex-col items-center md:py-16 md:after:pt-[5.5rem]"
    word={LANG === `en` ? `Updated` : `Libros`}
    title={LANG === `en` ? `Updated Editions` : `Libros`}
  >
    <Dual.P className="body-text pb-12 max-w-screen-md leading-loose">
      <>
        We currently have <b>{books.length}</b> books available in an{` `}
        <em>updated edition</em>, with more being added regularly. Our updated editions
        are our top recommendation for most visitors to this site. For more information
        about our editions,{` `}
        <Link href="/editions" className="subtle-link">
          see here
        </Link>
        .
      </>
      <>
        Más abajo puedes desplazarte por todos los libros que están actualmente
        disponibles en español. Si no estás seguro por dónde empezar, hemos preparado
        algunas recomendaciones para ti en nuestra página{` `}
        <Link href={t`/getting-started`} className="subtle-link">
          Comenzar
        </Link>
        .
      </>
    </Dual.P>
    <BookSlider books={books} />
  </BgWordBlock>
);

export default UpdatedEditionsBlock;
