import {
  CoverWebStylesAllStatic,
  CoverWebStylesSizes,
} from '@friends-library/cover-component';
import type { StoryFn } from '@storybook/react';

export default function WebCoverStyles(Story: StoryFn): JSX.Element {
  return (
    <>
      <Story />
      <CoverWebStylesAllStatic />
      <CoverWebStylesSizes />
    </>
  );
}
