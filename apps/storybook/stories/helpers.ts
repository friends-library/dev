export function props<T>(args: T): { args: T } {
  return { args };
}

export const SHORT_LOREM = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas tempora necessitatibus magni culpa ab placeat saepe vitae doloremque ipsa debitis laudantium, eos quasi veniam, dicta alias. Aliquam reiciendis aliquid perspiciatis? Lorem ipsum, dolor sit amet consectetur adipisicing elit.`;

export const MEDIUM_LOREM = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam tempore debitis alias sapiente similique illum quidem at, aliquid ducimus magnam facilis placeat esse dolorum dicta quam, veritatis libero asperiores vitae! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi totam porro corrupti vitae? Eaque rem ad possimus quae excepturi incidunt quos distinctio officia ab optio iusto inventore, recusandae officiis laudantium. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed doloremque dicta, dolorum ducimus eius temporibus pariatur quaerat, tempore accusantium corrupti eos vero laudantium dolorem minus placeat iste harum modi optio?`;

export const LONG_LOREM = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas tempora necessitatibus magni culpa ab placeat saepe vitae doloremque ipsa debitis laudantium, eos quasi veniam, dicta alias. Aliquam reiciendis aliquid perspiciatis? Lorem ipsum dolor, sit amet consectetur adipisicing elit. At harum aspernatur neque enim natus veritatis laborum ut eius libero voluptates earum quis ullam cupiditate odit, et ab id cum similique! Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos molestias aliquid quo suscipit in iusto quos, porro cum asperiores laudantium consequatur blanditiis, provident architecto facere! Odio ratione neque aspernatur corporis! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit excepturi alias non quidem laborum nemo eveniet quis similique soluta voluptatum libero commodi architecto, animi, et quos sed esse, dolores amet.`;

export const DOCUMENT_1 = {
  isbn: ``,
  title: `A Brief Account of my Exercises from my Childhood`,
  slug: ``,
  id: `123`,
  customCSS: ``,
  customHTML: ``,
  authorName: `Christian Man`,
  authorSlug: ``,
  authorGender: `male`,
  shortDescription: SHORT_LOREM,
  publishedRegion: `England`,
  publishedYear: 1722,
  hasAudio: true,
  editions: [],
  tags: [],
  createdAt: new Date().toISOString(),
  mostModernEdition: {
    type: `updated`,
    numPages: [200],
    size: 'm',
    audiobook: null,
    impressionCreatedAt: new Date().toISOString(),
  },
  featuredDescription: SHORT_LOREM,
};

export const DOCUMENT_2 = {
  isbn: ``,
  title: `A Treatise Concerning the Fear of God`,
  slug: ``,
  id: `456`,
  customCSS: ``,
  customHTML: ``,
  authorName: `Christian Woman`,
  authorSlug: ``,
  authorGender: `female`,
  shortDescription: SHORT_LOREM,
  publishedRegion: `Scotland`,
  publishedYear: 1678,
  hasAudio: false,
  editions: [],
  tags: [],
  createdAt: new Date().toISOString(),
  mostModernEdition: {
    type: `modernized`,
    numPages: [600],
    size: 'm',
    audiobook: null,
    impressionCreatedAt: new Date().toISOString(),
  },
  featuredDescription: SHORT_LOREM,
};
