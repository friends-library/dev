import React from 'react';
import type { EbookColorScheme } from '../types';
import tw from '../lib/tailwind';
import { LANG } from '../env';
import FullscreenError from './FullscreenError';

const EbookError: React.FC<{
  colorScheme: EbookColorScheme;
  reason: `no_internet` | `unknown`;
}> = ({ reason, colorScheme }) => (
  <FullscreenError
    errorMsg={message(reason)}
    bgColor={tw.color(`ebookcolorscheme-${colorScheme}bg`) ?? ``}
    textColor={tw.color(`ebookcolorscheme-${colorScheme}fg`) ?? ``}
  />
);

export default EbookError;

function message(reason: `no_internet` | `unknown`): string | undefined {
  if (reason === `no_internet`) {
    return LANG === `en`
      ? `Unable to download, no internet connection.`
      : `No es posible descargar, no hay conexión de internet.`;
  }
  return undefined;
}
