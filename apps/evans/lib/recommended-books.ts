const recommendedBooks = {
  history: {
    en: [
      book(`william-penn`, `primitive-christianity-revived`),
      book(`william-sewel`, `history-of-quakers`),
      book(`mary-ann-kelty`, `lives-of-primitive-quakers`),
      book(`john-gough`, `history-of-the-quakers-v1`),
    ],
    es: [
      book(`william-penn`, `restauracion-del-cristianismo-primitivo`),
      book(`william-sewel`, `historia-de-los-cuaqueros`),
    ],
  },
  doctrine: {
    en: [
      book(`robert-barclay`, `saved-to-the-uttermost`),
      book(`joseph-phipps`, `original-and-present-state-of-man`),
      book(`isaac-penington`, `writings-volume-1`),
      book(`isaac-penington`, `writings-volume-2`),
      book(`robert-barclay`, `waiting-upon-the-lord`),
      book(`thomas-story`, `journal`),
    ],
    es: [
      book(`robert-barclay`, `esta-grande-salvacion`),
      book(`joseph-phipps`, `estado-original-y-presente-del-hombre`),
      book(`william-penn`, `no-cruz-no-corona`),
      book(`john-spalding`, `salgan-de-babilonia`),
      book(`robert-barclay`, `esperando-en-el-senor`),
      book(`charles-marshall`, `camino-de-vida-revelado`),
    ],
  },
  spiritualLife: {
    en: [
      book(`hugh-turford`, `walk-in-the-spirit`),
      book(`isaac-penington`, `writings-volume-1`),
      book(`isaac-penington`, `writings-volume-2`),
      book(`william-penn`, `no-cross-no-crown`),
      book(`stephen-crisp`, `plain-pathway`),
      book(`francis-howgill`, `mysteries-of-gods-kingdom-declared`),
      book(`william-shewen`, `meditations-experiences`),
      book(`compilations`, `piety-promoted-v1`),
    ],
    es: [
      book(`hugh-turford`, `andar-en-el-espiritu`),
      book(`isaac-penington`, `escritos-volumen-1`),
      book(`isaac-penington`, `escritos-volumen-2`),
      book(`william-shewen`, `meditaciones-experiencias`),
      book(`stephen-crisp`, `camino-simple`),
      book(`stephen-crisp`, `babilonia-hasta-bet-el`),
      book(`francis-howgill`, `algunos-de-los-misterios-del-reino`),
    ],
  },
  journals: {
    en: [
      book(`compilations`, `truth-in-the-inward-parts-v1`),
      book(`compilations`, `truth-in-the-inward-parts-v2`),
      book(`compilations`, `truth-in-the-inward-parts-v3`),
      book(`john-richardson`, `journal`),
      book(`jane-pearson`, `life`),
      book(`john-gratton`, `journal`),
      book(`john-conran`, `journal`),
      book(`thomas-story`, `journal`),
      book(`james-parnell`, `life`),
      book(`william-edmundson`, `journal`),
      book(`isaac-martin`, `journal`),
    ],
    es: [
      book(`compilaciones`, `verdad-en-lo-intimo-v1`),
      book(`compilaciones`, `verdad-en-lo-intimo-v2`),
      book(`james-parnell`, `vida`),
      book(`alice-hayes`, `vida`),
      book(`francis-howgill`, `seleccion-de-la-vida`),
      book(`david-ferris`, `seleccion-del-diario`),
    ],
  },
};

export default recommendedBooks;

function book(
  friendSlug: string,
  documentSlug: string,
): { friendSlug: string; documentSlug: string } {
  return {
    friendSlug,
    documentSlug,
  };
}
