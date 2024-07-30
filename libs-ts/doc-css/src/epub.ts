import * as css from './css';

export function epub(config: { customCss?: string } = {}): string {
  return [
    css.common,
    css.signedSections,
    css.tables,
    css.ebookCommon,
    css.ebookEpub,
    css.ebookIntermediateTitle,
    ...(config.customCss ? [config.customCss] : []),
  ].join(`\n\n`);
}
