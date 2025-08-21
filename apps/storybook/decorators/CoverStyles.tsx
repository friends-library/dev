import {
  CoverWebStylesAllStatic,
  CoverWebStylesSizes,
} from '@friends-library/cover-component';
import type { StoryFn } from '@storybook/nextjs';

export default function WebCoverStyles(Story: StoryFn): JSX.Element {
  return (
    <>
      <Story />
      <CoverWebStylesAllStatic />
      <CoverWebStylesSizes />
    </>
  );
}
