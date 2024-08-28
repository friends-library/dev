import type { Meta, StoryObj } from '@storybook/react';
import WebCoverStyles from '../decorators/CoverStyles';
import { SHORT_LOREM, props } from './helpers';
import BookByFriend from '@/app/(friend)/BookByFriend';

const meta = {
  title: 'Friend/BookByFriend', // eslint-disable-line
  component: BookByFriend,
  parameters: {
    layout: `centered`,
    backgrounds: {
      default: `offwhite`,
      values: [{ name: `offwhite`, value: `rgb(240, 240, 240)` }],
    },
  },
  decorators: [WebCoverStyles],
} satisfies Meta<typeof BookByFriend>;

type Story = StoryObj<typeof meta>;

export const ExtraLarge: Story = props({
  key: ``,
  htmlShortTitle: `The Journal of Joe Bob`,
  isAlone: false,
  className: ``,
  tags: [`Journal`],
  hasAudio: true,
  bookUrl: ``,
  numDownloads: 1247,
  pages: [700, 600],
  description: SHORT_LOREM,
  lang: `en`,
  title: `The Journal of Joe Bob`,
  blurb: ``, // never see the back of a book in this component
  isCompilation: false,
  author: `Joe Bob`,
  size: `xl`,
  edition: `modernized`,
  isbn: ``,
  customCss: ``,
  customHtml: ``,
});

export const Medium: Story = props({
  ...ExtraLarge.args,
  tags: [`Journal`, `Poetry`],
  pages: [350],
  size: `m`,
  edition: `original`,
});

export const Small: Story = props({
  ...Medium.args,
  pages: [160],
  size: `s`,
  edition: `updated`,
});

export default meta;
