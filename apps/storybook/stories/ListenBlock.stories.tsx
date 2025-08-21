import type { Meta, StoryObj } from '@storybook/nextjs';
import { props } from './helpers';
import ListenBlock from '@/app/[friend_slug]/[document_slug]/ListenBlock';

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
      mp3Url: { lq: `/track1.mp3`, hq: `/track1.mp3` },
      duration: 1234,
    },
    {
      title: `Track 2`,
      mp3Url: { lq: `/track2.mp3`, hq: `/track2.mp3` },
      duration: 1234,
    },
    {
      title: `Track 3`,
      mp3Url: { lq: `/track3.mp3`, hq: `/track3.mp3` },
      duration: 2345,
    },
  ],
  isIncomplete: false,
  m4bFilesize: { hq: 109234783, lq: 40698958 },
  mp3ZipFilesize: { hq: 54304578, lq: 30735831 },
  m4bLoggedDownloadUrl: { hq: ``, lq: `` },
  mp3ZipLoggedDownloadUrl: { hq: ``, lq: `` },
  podcastLoggedDownloadUrl: { hq: ``, lq: `` },
  mp3LoggedDownloadUrls: [{ hq: ``, lq: `` }],
});

export const SingleTrack: Story = props({
  ...Default.args,
  tracks: [
    {
      title: `Track 1`,
      mp3Url: { lq: `/track1.mp3`, hq: `/track1.mp3` },
      duration: 1234,
    },
  ],
});

export default meta;
