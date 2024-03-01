import DownloadAudiobook from '@evans/pages/document/DownloadAudiobook';
import type { Meta, StoryObj } from '@storybook/react';
import { props } from './helpers';

const meta = {
  title: 'Document/DownloadAudiobook', // eslint-disable-line
  component: DownloadAudiobook,
  parameters: {
    layout: `centered`,
    backgrounds: {
      default: `offwhite`,
      values: [{ name: `offwhite`, value: `rgb(240, 240, 240)` }],
    },
  },
} satisfies Meta<typeof DownloadAudiobook>;

type Story = StoryObj<typeof meta>;

export const Default: Story = props({
  title: `Cool book`,
  quality: `hq`,
  isIncomplete: false,
  numAudioParts: 1,
  m4bFilesize: { hq: 109234783, lq: 40698958 },
  mp3ZipFilesize: { hq: 54304578, lq: 30735831 },
  m4bLoggedDownloadUrl: { hq: ``, lq: `` },
  mp3ZipLoggedDownloadUrl: { hq: ``, lq: `` },
  podcastLoggedDownloadUrl: { hq: ``, lq: `` },
  mp3LoggedDownloadUrls: [{ hq: ``, lq: `` }],
  embedId: { hq: 3, lq: 4 },
  setQuality: () => {},
});

export default meta;
