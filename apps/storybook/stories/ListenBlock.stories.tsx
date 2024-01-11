import ListenBlock from '@evans/pages/document/ListenBlock';
import type { Meta, StoryObj } from '@storybook/react';
import { props } from './helpers';

const meta = {
  title: 'Document/ListenBlock', // eslint-disable-line
  component: ListenBlock,
  parameters: {
    layout: `fullscreen`,
  },
} satisfies Meta<typeof ListenBlock>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  tracks: [
    {
      title: `Track 1`,
      url: `https://flp-assets.nyc3.cdn.digitaloceanspaces.com/audio/track1.mp3`,
    },
    {
      title: `Track 2`,
      url: `https://flp-assets.nyc3.cdn.digitaloceanspaces.com/audio/track2.mp3`,
    },
    {
      title: `Track 3`,
      url: `https://flp-assets.nyc3.cdn.digitaloceanspaces.com/audio/track3.mp3`,
    },
  ],
  isIncomplete: false,
  m4bFilesize: { hq: 109234783, lq: 40698958 },
  mp3ZipFilesize: { hq: 54304578, lq: 30735831 },
  m4bLoggedDownloadUrl: { hq: ``, lq: `` },
  mp3ZipLoggedDownloadUrl: { hq: ``, lq: `` },
  podcastLoggedDownloadUrl: { hq: ``, lq: `` },
  embedId: { hq: 3, lq: 4 },
});

export default meta;
