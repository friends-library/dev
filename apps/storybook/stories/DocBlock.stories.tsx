import DocBlock from '@evans/pages/document/DocBlock';
import WebCoverStyles from 'decorators/CoverStyles';
import type { Meta, StoryObj } from '@storybook/react';
import { MEDIUM_LOREM, props } from './helpers';

const meta = {
  title: 'Document/DocBlock', // eslint-disable-line
  component: DocBlock,
  parameters: {
    layout: `fullscreen`,
  },
  decorators: [WebCoverStyles],
} satisfies Meta<typeof DocBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  friendSlug: `john-doe`,
  friendName: `John Doe`,
  friendGender: `male`,
  title: `The Life and Letters of John Doe`,
  htmlShortTitle: `The Life and Letters of John Doe`,
  htmlTitle: `The Life and Letters of John Doe`,
  description: MEDIUM_LOREM,
  isComplete: true,
  priceInCents: 300,
  hasAudio: true,
  numDownloads: 300,
  isCompilation: false,
  editions: [
    {
      id: `123`,
      type: `updated`,
      numPages: [300],
      isbn: `1234567890`,
      printSize: `m`,
      loggedDownloadUrls: {
        pdf: `/`,
        epub: `/`,
        speech: `/`,
      },
    },
  ],
  primaryEdition: {
    numChapters: 10,
    editionType: `updated`,
    printSize: `m`,
    paperbackVolumes: [300],
    isbn: `1234567890`,
    title: `The Life and Letters of John Doe`,
    description: MEDIUM_LOREM,
    isCompilation: false,
    friendName: `John Doe`,
  },
});

export default meta;
