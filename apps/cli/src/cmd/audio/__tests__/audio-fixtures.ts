import { EditionType, Lang, TagType } from '../../../graphql/globalTypes';
import { Audio } from '../types';

// see below for query used to generate these

export const turfordEn: Audio = {
  id: `26e7c6d5-93b0-43d1-8017-4d3efadd4a5b`,
  m4bSizeHq: 118115017,
  mp3ZipSizeHq: 70676869,
  mp3ZipSizeLq: 35643613,
  isIncomplete: false,
  reader: `Jason R. Henderson`,
  externalPlaylistIdLq: 971898961,
  parts: [
    {
      mp3SizeHq: 27791086,
      id: `337d2e74-c3bf-446a-a853-0fa2a758628d`,
      externalIdHq: 613633581,
      title: `Part 1`,
      order: 1,
      chapters: [0],
      duration: 2853.25,
      externalIdLq: 613633605,
      mp3SizeLq: 14313893,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 21052333,
      id: `88be48c4-058c-488f-af67-72cca4cc292d`,
      externalIdHq: 613632639,
      title: `Part 2`,
      order: 2,
      chapters: [1],
      duration: 2190.81,
      externalIdLq: 613632663,
      mp3SizeLq: 11001697,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 22619511,
      id: `a2bf9e5d-03d7-4cf6-833b-4a5d4ef35b12`,
      externalIdHq: 622219650,
      title: `The Grace that Brings Salvation`,
      order: 3,
      chapters: [2],
      duration: 2218.58,
      externalIdLq: 622219674,
      mp3SizeLq: 11140478,
      __typename: `AudioPart`,
    },
  ],
  edition: {
    path: `en/hugh-turford/walk-in-the-spirit/updated`,
    id: `6e2e1153-9c88-40f2-b469-05bf25e03ad7`,
    __typename: `Edition`,
    document: {
      friend: {
        __typename: `Friend`,
        slug: `hugh-turford`,
        lang: Lang.en,
        name: `Hugh Turford`,
        alphabeticalName: `Turford, Hugh`,
        isCompilations: false,
      },
      path: `en/hugh-turford/walk-in-the-spiri/`,
      slug: `walk-in-the-spirit`,
      title: `Walk in the Spirit`,
      filename: `Walk_in_the_Spirit`,
      description: `The primitive Christians built on a sure rock, a living foundation, on Christ as He was in all ages, and still is—on His spiritual appearance as the light of the world, and the life of righteousness. His work of sanctification is inward, and is to be effected by inward means. Nothing but inward light can expel inward darkness; nothing less than eternal life can deliver our souls from the power of death. But this way of God’s salvation has been so long rejected, that few in our present age know what His Spirit is, where they may become acquainted with it, or how they may walk in it.`,
      __typename: `Document`,
      tags: [
        { type: TagType.doctrinal, __typename: `DocumentTag` },
        { type: TagType.treatise, __typename: `DocumentTag` },
      ],
    },
    type: EditionType.updated,
    images: {
      square: {
        w1400: {
          path: `en/hugh-turford/walk-in-the-spirit/updated/images/cover--1400x1400.png`,
          __typename: `EditionImage`,
        },
        __typename: `EditionSquareImages`,
      },
      __typename: `EditionImages`,
    },
  },
  externalPlaylistIdHq: 971886379,
  __typename: `Audio`,
  m4bSizeLq: 45397990,
};

export const story: Audio = {
  id: `ec46d070-8659-4c5a-96c1-7dbb55f8b736`,
  m4bSizeHq: 61848805,
  mp3ZipSizeHq: 34318013,
  mp3ZipSizeLq: 18431238,
  isIncomplete: false,
  reader: `Jason R. Henderson`,
  externalPlaylistIdLq: null,
  parts: [
    {
      mp3SizeHq: 34907944,
      id: `6de3f4dc-b873-4e52-acd3-6dcd7c441c70`,
      externalIdHq: 748336924,
      title: `Journal of Thomas Story`,
      order: 1,
      chapters: [0],
      duration: 3755.38,
      externalIdLq: 748336549,
      mp3SizeLq: 18865257,
      __typename: `AudioPart`,
    },
  ],
  edition: {
    path: `en/thomas-story/journal-selection/updated`,
    id: `7b2fa5a7-9a56-4a5f-8bd3-929a97875485`,
    __typename: `Edition`,
    document: {
      friend: {
        __typename: `Friend`,
        slug: `thomas-story`,
        lang: Lang.en,
        name: `Thomas Story`,
        alphabeticalName: `Story, Thomas`,
        isCompilations: false,
      },
      path: `en/thomas-story/journal-selection`,
      slug: `journal-selection`,
      title: `Selection from the Journal of Thomas Story`,
      filename: `Selection_Journal_of_Thomas_Story`,
      description: `Thomas Story (1662-1742) was an extremely gifted and serviceable minister in the Society of Friends, who traveled all over England, Ireland, Scotland, Holland, Jamaica, Barbados, and the American colonies in his service for the gospel. He was well-known for both his spiritual depth and his intellectual genius. His clear perception of spiritual truth, profound knowledge of Scripture, and facility of expression made him more than a match for the enemies of truth who attempted to slander and oppose the teachings of early Friends. The many compelling doctrinal arguments found in his journal became very influential among Quakers, and will still be read with great benefit by every genuine seeker of truth.`,
      __typename: `Document`,
      tags: [{ type: TagType.journal, __typename: `DocumentTag` }],
    },
    type: EditionType.updated,
    images: {
      square: {
        w1400: {
          path: `en/thomas-story/journal-selection/updated/images/cover--1400x1400.png`,
          __typename: `EditionImage`,
        },
        __typename: `EditionSquareImages`,
      },
      __typename: `EditionImages`,
    },
  },
  externalPlaylistIdHq: null,
  __typename: `Audio`,
  m4bSizeLq: 24234464,
};

export const webbEs: Audio = {
  id: `04a22074-fd31-4057-919d-d37f0563ea56`,
  m4bSizeHq: 57152342,
  mp3ZipSizeHq: 25628863,
  mp3ZipSizeLq: 16697272,
  isIncomplete: false,
  reader: `Keren Alvaredo`,
  externalPlaylistIdLq: null,
  parts: [
    {
      mp3SizeHq: 26740139,
      id: `59d89427-166b-4e3a-9e73-7e00cac7316c`,
      externalIdHq: 809112163,
      title: `La Carta de Elizabeth Webb`,
      order: 1,
      chapters: [0],
      duration: 3405.22,
      externalIdLq: 809111311,
      mp3SizeLq: 17099705,
      __typename: `AudioPart`,
    },
  ],
  edition: {
    path: `es/elizabeth-webb/carta/updated`,
    id: `ee9f4b22-f042-47b3-b817-023992c01349`,
    __typename: `Edition`,
    document: {
      friend: {
        __typename: `Friend`,
        slug: `elizabeth-webb`,
        lang: Lang.es,
        name: `Elizabeth Webb`,
        alphabeticalName: `Webb, Elizabeth`,
        isCompilations: false,
      },
      slug: `carta`,
      title: `La Carta de Elizabeth Webb`,
      filename: `Carta_de_Elizabeth_Webb`,
      path: `es/elizabeth-webb/carta`,
      description: `Elizabeth Webb (1663-1726) fue una antigua ministra de la Sociedad de Amigos que viajó extensamente en su servicio por el evangelio. En el año 1712, mientras ejercía su ministerio en Londres, conoció a Anthony William Boehm, quien en ese entonces era capellán del Príncipe George de Dinamarca. En cierto momento después de su primer encuentro, Elizabeth Webb se sintió constreñida por el amor de Dios a escribirle a Boehm y enviarle una carta profundamente instructiva (la cual se encuentra en este libro), dándole un resumen de su viaje espiritual.`,
      __typename: `Document`,
      tags: [
        { type: TagType.letters, __typename: `DocumentTag` },
        { type: TagType.journal, __typename: `DocumentTag` },
      ],
    },
    type: EditionType.updated,
    images: {
      square: {
        w1400: {
          path: `es/elizabeth-webb/carta/updated/images/cover--1400x1400.png`,
          __typename: `EditionImage`,
        },
        __typename: `EditionSquareImages`,
      },
      __typename: `EditionImages`,
    },
  },
  externalPlaylistIdHq: null,
  __typename: `Audio`,
  m4bSizeLq: 22051722,
};

export const titipEn: Audio = {
  id: `7f6249d1-ada3-4dc6-9861-9d7ac87640fb`,
  m4bSizeHq: 508158245,
  mp3ZipSizeHq: 286997341,
  mp3ZipSizeLq: 153238498,
  isIncomplete: false,
  reader: `Jason R. Henderson`,
  externalPlaylistIdLq: 1009947181,
  parts: [
    {
      mp3SizeHq: 9701985,
      id: `5e9a36f6-69e4-46f8-8033-049ef28e6fb4`,
      externalIdHq: 276638170,
      title: `Introduction`,
      order: 1,
      chapters: [0],
      duration: 1119.91,
      externalIdLq: 276638179,
      mp3SizeLq: 5682773,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 26960812,
      id: `4bf4ebd5-8922-4936-a243-0b0552faa296`,
      externalIdHq: 277542991,
      title: `Letter of Elizabeth Webb`,
      order: 4,
      chapters: [3],
      duration: 2848.33,
      externalIdLq: 277543001,
      mp3SizeLq: 14324886,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 29371346,
      id: `6be9acd4-a7b8-4418-b86f-39363e1a9afb`,
      externalIdHq: 276790389,
      title: `Life of Stephen Crisp`,
      order: 2,
      chapters: [1],
      duration: 3202.77,
      externalIdLq: 276790407,
      mp3SizeLq: 16097158,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 22392010,
      id: `8686be22-38ae-4955-92c4-e93e0364d1ea`,
      externalIdHq: 279985715,
      title: `Life of Elizabeth Stirredge`,
      order: 9,
      chapters: [8],
      duration: 2425.39,
      externalIdLq: 279985720,
      mp3SizeLq: 12210150,
      __typename: `AudioPart`,
    },

    {
      mp3SizeHq: 21033869,
      id: `db413bc6-e8a7-4bb3-8156-45cfdb705070`,
      externalIdHq: 278405473,
      title: `Life of Joseph Pike`,
      order: 6,
      chapters: [5],
      duration: 2212.91,
      externalIdLq: 278405495,
      mp3SizeLq: 11147734,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 30818815,
      id: `83855692-ad45-4995-aa74-3a19d85066d0`,
      externalIdHq: 279389047,
      title: `Memoirs of John Crook`,
      order: 8,
      chapters: [7],
      duration: 3290.99,
      externalIdLq: 279389077,
      mp3SizeLq: 16538236,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 30067028,
      id: `ad9ba256-6690-4ed4-b16e-b67a70de1789`,
      externalIdHq: 278743551,
      title: `Journal of John Griffith`,
      order: 7,
      chapters: [6],
      duration: 3226.73,
      externalIdLq: 278743565,
      mp3SizeLq: 16216935,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 34189901,
      id: `c091b6e0-a6c4-4d91-86d6-9467a7a45278`,
      externalIdHq: 277873585,
      title: `Journal of John Burnyeat`,
      order: 5,
      chapters: [4],
      duration: 3514.86,
      externalIdLq: 277873611,
      mp3SizeLq: 17657588,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 34991211,
      id: `78a099b1-1398-4517-9ecd-79cc998321ef`,
      externalIdHq: 281992929,
      title: `Life of Thomas Story`,
      order: 11,
      chapters: [10],
      duration: 3759.91,
      externalIdLq: 281992954,
      mp3SizeLq: 18882855,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 21383288,
      id: `dd6cbb58-c09a-4a80-bbf5-07ce9ebc8fcb`,
      externalIdHq: 280576517,
      title: `Journal of Charles Marshall`,
      order: 10,
      chapters: [9],
      duration: 2287.22,
      externalIdLq: 280576523,
      mp3SizeLq: 11519342,
      __typename: `AudioPart`,
    },
    {
      mp3SizeHq: 31330034,
      id: `5e0977c0-d58c-4555-9512-8a9faba379d3`,
      externalIdHq: 276947054,
      title: `Life of John Richardson`,
      order: 3,
      chapters: [2],
      duration: 3317.56,
      externalIdLq: 276947064,
      mp3SizeLq: 16671072,
      __typename: `AudioPart`,
    },
  ],
  edition: {
    path: `en/compilations/truth-in-the-inward-parts-v1/updated`,
    id: `5a26698d-29bc-4738-beb7-5f65fc5de26a`,
    __typename: `Edition`,
    document: {
      friend: {
        __typename: `Friend`,
        slug: `compilations`,
        lang: Lang.en,
        name: `Compilations`,
        alphabeticalName: `Compilations`,
        isCompilations: true,
      },
      path: `en/compilations/truth-in-the-inward-parts-v1`,
      slug: `truth-in-the-inward-parts-v1`,
      title: `Truth in the Inward Parts -- Volume 1`,
      filename: `Truth_in_the_Inward_Parts_v1`,
      description: `This book contains the stories of ten men and women who knew the transforming work of “Truth in the inward parts.” Amidst a sea of Christian practice and profession, these believers would settle for nothing less than the light, power, and righteousness of Christ reigning in their purified vessels. They not only found the Pearl of great price by His own inward appearing, but they then sold all to buy this treasure, counting all things loss for the excellence of the knowledge of Christ Jesus their Lord. (Compiled and edited by Jason R. Henderson)`,
      __typename: `Document`,
      tags: [{ type: TagType.journal, __typename: `DocumentTag` }],
    },
    type: EditionType.updated,
    images: {
      square: {
        w1400: {
          path: `en/compilations/truth-in-the-inward-parts-v1/updated/images/cover--1400x1400.png`,
          __typename: `EditionImage`,
        },
        __typename: `EditionSquareImages`,
      },
      __typename: `EditionImages`,
    },
  },
  externalPlaylistIdHq: 1009946857,
  __typename: `Audio`,
  m4bSizeLq: 194863722,
};

export const wayOfLife: Audio = {
  id: `89706ef7-5daf-48f8-856b-70bb33d77d19`,
  m4bSizeHq: 87710778,
  mp3ZipSizeHq: 52317961,
  mp3ZipSizeLq: 26176957,
  isIncomplete: false,
  reader: `Jason R. Henderson`,
  externalPlaylistIdLq: null,
  parts: [
    {
      mp3SizeHq: 52877088,
      id: `dbfaa671-9ce1-4b3f-b66b-3ef31af35ea4`,
      externalIdHq: 881273452,
      title: `The Way of Life Revealed and the Way of Death Discovered`,
      order: 1,
      chapters: [0],
      duration: 5328.85,
      externalIdLq: 881272624,
      mp3SizeLq: 26762367,
      __typename: `AudioPart`,
    },
  ],
  edition: {
    path: `en/charles-marshall/way-of-life-revealed/updated`,
    id: `e89669d8-94a3-4830-86b1-0a56348031b8`,
    __typename: `Edition`,
    document: {
      friend: {
        __typename: `Friend`,
        slug: `charles-marshall`,
        lang: Lang.en,
        name: `Charles Marshall`,
        alphabeticalName: `Marshall, Charles`,
        isCompilations: false,
      },
      path: `en/charles-marshall/way-of-life-revealed`,
      slug: `way-of-life-revealed`,
      title: `The Way of Life Revealed and the Way of Death Discovered`,
      filename: `Way_of_Life_Revealed`,
      description: `Charles Marshall (1637-1698) was convinced of the Truth at age seventeen by the powerful ministry of John Audland and John Camm, and eventually became a worthy minister and elder himself in the early Society of Friends. This short treatise, written in 1673, describes the miserable condition of man in the fall, the means by which God restores the penitent soul into the image of God, and many snares, deceptions and temptations of the enemy of man’s happiness.`,
      __typename: `Document`,
      tags: [{ type: TagType.treatise, __typename: `DocumentTag` }],
    },
    type: EditionType.updated,
    images: {
      square: {
        w1400: {
          path: `en/charles-marshall/way-of-life-revealed/updated/images/cover--1400x1400.png`,
          __typename: `EditionImage`,
        },
        __typename: `EditionSquareImages`,
      },
      __typename: `EditionImages`,
    },
  },
  externalPlaylistIdHq: null,
  __typename: `Audio`,
  m4bSizeLq: 34387276,
};

// query

export const __QUERY = `
  query GetFixtures {
    audios: getAudios {
      __typename
      id
      isIncomplete
      m4bSizeHq
      m4bSizeLq
      mp3ZipSizeHq
      mp3ZipSizeLq
      reader
      externalPlaylistIdHq
      externalPlaylistIdLq
      parts {
        __typename
        id
        chapters
        duration
        title
        order
        externalIdHq
        externalIdLq
        mp3SizeHq
        mp3SizeLq
      }
      edition {
        __typename
        id
        path: directoryPath
        type
        images {
          __typename
          square {
            __typename
            w1400 {
              __typename
              path
            }
          }
        }
        document {
          __typename
          filename
          title
          slug
          description
          path: directoryPath
          tags {
            __typename
            type
          }
          friend {
            __typename
            lang
            name
            slug
            alphabeticalName
            isCompilations
          }
        }
      }
    }
  }
`;
