import React from 'react';
import cx from 'classnames';

interface Props {
  tailwindColor?: string;
  height?: number;
  style?: Record<string, string | number>;
}

export const Male: React.FC<Props> = ({
  height = 246.4,
  tailwindColor = `flprimary`,
  style = {},
}) => (
  <svg height={height} width={45500 / height} viewBox="0 0 663 881" style={style}>
    <path
      className={cx(`text-${tailwindColor} fill-current`)}
      d="M113 405l.3 1.5.2 1.6v1.9l-.5 1-.5 1-1.3 2-1.1 2-1 2-.5 1-1.2 2-1.2 2-.7 1-.7 1-.8 1-.8 1-1.5 2-1.3 2-.6 1-.5 1-.5 1-1.2 2-.8 1-1.4 2-1.5 2-.8 1-1.5 2-.7 1-1.3 2-1.1 2-.6 1-.5 1-1.2 2-.5 1-1 2-.7 1-1.1 2-.9 2-.4 1-.4 1-1 2-.7.8-.8.8-1.7 1.6-1 .9-.8 1-.8.9-.7 1-1.4 2-.7 1-1.7 2-1.6 2-1.2 2-.5 1-1 1.8-1.3 1.6-.7.8-.7.9-1.5 1.9-.8 1-.8 1-.9 1-.8 1-1.7 2-1.4 2-.6 1-.6 1-1.3 2-.7 1-1.6 2-.8 1-1.6 2-1.6 2-.7 1-1.3 2-.6 1-1.5 2-.7 1-1.4 2-1.4 2-1.6 2-1.5 2-.6 1-.5 1-.8 2-.5 1-.5 1-1.2 2-.6 1-.6 1-.4 1-.6 1-.4 1-1.3 2-.7 1-1.6 2-.7 1-.7 1-1.2 2-.7 1-1.2 2-.6 1.5-.1 1.5 1.3-.4 1-1 1.4-1.6.7-1 .8-1 1.8-1.6 1-.8 2-1.5 1-.7 2-1.3 2-1 2-1 1-.6 1-.6 2-1.3 1-.5 1-.5 1-.4 1-.4 1.8-.9 1.6-1 1.7-1.2 1.9-1 2-.8 2-.6 2-.7 2-.8 1-.4 1-.2 2-.6 1-.2 2-.3h1l2-.1h24l2 .4 1 .2 2 .3h1l2 .1h1l2 .4 1 .2 2 .3 1 .2 2 .3 1 .2 1 .2 2 .4 1 .2 1 .2 2 .3h1l2 .1h1l2 .4 2 .6 1 .4 2 1 1 .5 2 1 2 .7 2 .3 2 .4 1 .3 2 .8 2 .7 1 .3 1 .2 1 .3 2 .5 1 .3 2 .6 1 .3 1 .3 2 .5 1 .4 2 .7 1 .3 2 .4 2 .4 1 .2 1 .2 2 .5 2 .8 1 .5 1 .4 1 .6 1 .5 2 1.2 2 1.6 1 .8 2 1.6 1 .6 2 1 2 1 1 .5 2 1.1 1 .5 1 .4 2 .8 2 1 2 1.2 2 1.2 1 .7 1 .7 1 .8 2 1.6 1 .7 2 1.3 1 .6 2 1.2 2 1.2 2 1.1 1 .5 2 1.2 1 .6 2 1.2 1 .6 2 1.1 2 1.1 1 .6 2 1.3 1 .7 2 1.4 1 .6 2 1.1 2 1 1 .4 2 1 1 .5 1 .6 1 .5 1 .5 2 1 2 1.2 1 .5 2 1 2 .7 1.5.3 1.5.1.4 1.4 1 1.2 1.6 1 2 1 2 1.3 1 .7 1 .8 2 1.7 2 1.6 1 .8 2 1.3 1 .7 2 1.6 2 1.8 2 1.7 1 .8 2 1.7 1 .8 2 1.7 2 1.6 2 1.6 2 1.5 2 1.4 1 .7 1.6 1.7.8.8 1.7 1.7 1 .8 1.9 1.6 2 1.6 2 1.4 1 .7 1.6 1.3 1.6 1.3.9.7 1.7 1.4.8.8 1.6 1.6.9.8 1.9 1.6 2 1.6 2 1.5 2 1.3 1 .6 1.8 1.2.8.8 1.6 1.4.8.8 1.6 1.5.8.7 1.7 1.4 1.9 1.4 2 1.7 1 .8 2 1.7 1 .8 2 1.5 1 .7 1 .8 2 1.7 1 1 2 1.8 2 1.7 1 .8 1.6 1.4.8.8 1.7 1.2 1 .7 1.9 1.5 2 1.6 1 .8 2 1.7 2 1.9 1 1 2 1.6 1 .8 1 .7 1 .8 1 .7 2 1.4 2 1.3 2 1.4.8.6.8.7 1.4 1.4 1.3 1.7.7 1 1.4 1.9.8 1 1.7 2 .9 1 1.5 1.6.7.7.7.7 1.3 1.4 1.4 1.7.8 1 1.8 1.9 2 2 2 2 2 1.6.8.8.8.8 1.6 1.8.9 1 1.9 2 1 1 1 1 1.6 2 1.4 2 1.3 1.6.7.8 1.4 1.6 1.7 1.6.8.8 1.7 1.5.7.7.7.7 1.3 1.4 1.4 1.5 1.5 1.8 1.6 2 .8.8 1.4 1.6.7.8.7.9 1.7 1.9 1.9 2 2 2 .8 1 .7 1 1.3 2 .4 1 1.2 1.6.6.8 1.3 1.7 1.3 1.9.6 1 1.2 1.6 1.2 1.6 1.1 1.8.6 1 1 2 .7 1 1.3 1.6.7.8 1.3 1.7.7 1 1.2 1.9.6 1 .4 1 1.2 2 1.5 2 .7 1 .7 1 1.4 2 .7 1 1.5 2 .7 1 .8 1 .7 1 1.3 2 1.2 2 .6 1 1.4 2 1.3 2 1 2 .5 1 .5 1 .5 1 1.2 2 .6 1 1.2 2 1.5 2 .7.8 1.3 1.6 1.1 1.7.6 1 1.3 1.9.6 1 1 2 .8 2 .8 1.8.5.8.5.8 1.2 1.7 1.3 1.9.6 1 1.2 2 1.2 2 1.1 2 .6 1 1 2 .6 1 .5 1 .3.5.3 1.5 1.4-.4.4-.3.9-.6 1.4-1.7.7-1 .7-1 1-2 .8-2 .4-1 .7-2 .8-2 .4-1 .4-1 .6-2 .3-1 .5-2 .4-2 .1-1 .1-2v-15l-.4-2-.2-1-.3-2-.2-2-.1-1-.4-2-.3-2v-1l-.1-2v-1l-.5-2-.4-1-.4-1-.4-1-.9-2-.2-1-.6-2-.6-2-.4-1-.4-1-.4-1-.6-1-.8-2-.4-1-.6-2-.3-1-.5-2-.3-1-.3-1-.7-2-.3-1-.6-2-.3-1-.7-2-.9-2-.4-1-.4-1-.6-2-.2-1-.3-1-.6-2-.7-2-.3-1-.3-1-.3-1-.5-2-.3-1-.2-1-.3-1-.7-2-.4-1-1-2-.6-2-.3-1-.5-2-.7-2-.4-1-1-2-.4-1-.4-1-.7-2-.4-1-.5-1-1.2-2-1.3-2-.5-1-.5-1-.9-2-1-2-.5-1-.4-1-.6-1-.6-1-1.2-2-.6-1-1.2-2-1.2-2-1.1-2-.6-1-1-2-1.3-2-.6-1-1.2-2-1.4-2-.7-1-1.1-2-.5-1-.5-1-1.3-2-.7-1-.8-1-1.7-2-1.9-2-1-1-1-1-1.6-2-.8-1-1.5-2-.7-1-1.4-2-1.3-2-.7-1-1.4-2-.7-1-1.5-2-.6-1-1.2-2-1.4-2-.8-1-1.1-2-.5-1-.8-2-.6-2v-2l.4-2 .4-1 .3-.5.5-1.5h3l2 .4 1 .2 2 .2 1-.1 1.5-.6 1.5-1.1-.4-1.5-.3-.6-.7-1.9-1-2-.5-1-1-2-.5-1-.9-2-.5-1-.4-1-.6-1-.4-1-.6-1-.6-1-1.2-2-1.2-2-.6-1-.8-1-1.4-2-.7-1-1.4-2-1.2-2-1.1-2-.6-1-.6-1-1.2-2-.5-1-.7-2-.3-1-.5-2-.2-1-.3-1-.5-2-.8-2-.4-1-.5-2-.3-1-.4-2-.1-1-.1-2v-4l.4-2 .2-1 .4-2 .4-2 .3-1 .7-2 .4-1 .4-1 .6-1 1-2 .4-1 1.2-2 1.3-2 .7-1 1.7-2 1.9-2 1-1 2-1.5 1-.6 1-.6 1-.5 2-1 1-.5 2-1 1-.3 2-.7 2-.6 1-.3 2-.3 2-.1h3l2-.5 1-.3 1-.4 1-.4 2-1 2-1.3 1-.7 1-.8 1.6-1.7.7-1 1.4-1.9 1.3-2 .6-1 1.1-2 .5-1 1-2 .6-1 .4-1 .6-1 .7-2 .3-1 .4-2 .4-2 .2-1 .1-1 .1-2v-10l-.4-2-.2-1-.6-2-.2-1-.8-2-.4-1-.2-1-.6-2-.2-1v-2l.2-2 .2-1 .4-2 .2-1 .7-2 1-2 .5-1 1.1-2 .8-2 .3-1 .2-2v-2l-.1-2-.6-2-.6-1-1.2-2-.7-2 .4-2 .6-1 1.4-2 1.8-1.5 1-.7 2-1.3 1.5-1.6 1.2-1.9.8-2 .3-1 .4-2 .4-2 .3-2 .1-2v-6l.3-1 .2-1 .8-2 .5-1 .4-1 1.3-2 1.6-2 1-1 1.9-1.5 2-1.2 1-.5 1-.4 1-.4 1-.3 2-.7 2-.7 1-.3 2-.6 1-.2 1-.1 2-.1h3l2-.4 1-.2 2-.4 1-.2 1-.3 2-.8 1-.5 1-.4 2-1.3 1-.7 2-1.6 2-1.6 1-.8 1.5-1.8.6-1 .6-2 .3-2v-9l-.2-1-.2-1-.4-2-.2-2v-3l-.3-1-.2-1-.8-2-.5-1-.8-2-.8-2-.5-1-.6-1-1.3-2-.8-1-1.1-2-.5-1-1.3-2-1.6-2-.8-1-.9-1-.7-1-.6-1-.6-1-1-2-1-2-.7-2-.9-2-.5-1-.4-1-.5-1-.4-1-.5-1-.5-2-.3-1-.2-1-.3-2-.1-2v-2l-.2-1-.2-1-.6-2-.6-2-.3-2v-3l.1-1 .2-1 .3-1 .7-2 .4-1 .8-2 .8-2 .8-2 .4-1 .7-2 .5-2 .1-1 .1-2v-9l-.2-1-.4-2-.2-1-.1-1-.1-2v-4l-.4-2-.2-1-.2-1-.4-2-.3-1-.8-2-.5-1-.4-1-.5-1-.9-2-.5-2-.3-1-.3-1-.7-2-.4-1-.7-2v-2l.8-2 1.7-1.8 1-.7 2-1 2-.2 2 .3 2 .3 2 .1h3l2 .4 1 .3 2 .5 1 .2h2l2-.3 2-.1h2l2 .4 2 .4 1 .1 2 .2 1 .1 2 .4 2 .3h1l2 .1h19l2-.4 1-.2 2-.3 2-.1h55l1-.3 1-.2 2-.8 1-.4 2-.9 1-.2 1-.3 2-.6 1-.4 1.9-1.2.8-.8.7-1 .5-.9.4-1 .4-2-.2-2-1-1.7-1.6-1.2-1.9-1-1-.5-2-1.2-1-.6-2-1-1-.6-1-.4-1-.6-2-.8-1-.4-1-.3-1-.4-2-.6-1-.4-2-.7-2-.8-1-.3-1-.3-2-.4-2-.5-2-.7-1-.4-1-.4-1-.4-1-.4-2-.6-1-.3-2-.5-2-.8-1-.6-1-.4-2-.8-2-.6-2-.4-1-.3-1-.4-1-.6-1-.7-2-1.4-1-.5-2-1-2-1.1-1-.6-2-1.2-1-.6-1-.5-2-1-2-.7-1-.3-1-.3-1-.2-2-.8-1-.6-2-.7-1-.3-2-.2h-1l-2-.4-2-.4-2-.4-1-.3-2-.7-1-.4-2-.7-1-.3-1-.3-1-.2-2-.5-1-.2-2-.4-1-.2-1-.2-2-.5-1-.3-1-.3-2-.7-2-.8-1-.4-1-.2-2-.6-2-.6-2-.6-2-.4-1-.2-1-.2-1-.2-1-.3-2-.5-1-.3-1-.3-2-.7-1-.3-2-.6-1-.2-2-.4-2-.5-2-.7-1-.4-2-.7-1-.3-1-.2-2-.4-1-.2-2-.3-2-.1-1-.1-2-.6-2-1.4-.8-1-.7-.9-1.3-2-.4-1-.6-1-.4-1-1.2-2-.7-1-1.2-2-.7-2-.5-2-.4-1-1.1-2-1.1-2-.5-1-.4-1-.9-2-.5-1-1.2-2-1-2-.2-1-.6-2-.9-2-.4-1-1-2-.4-1-1-2-.5-1-1-2-.7-2-.3-1-.5-2-.3-1-.6-2-.4-1-.9-2-.5-1-.4-1-.6-1-.4-1-.6-1-.8-2-.4-1-.7-2-.4-1-1-2-.5-1-.6-1-.5-1-.8-2-.3-1-.5-2-.4-1-.5-1-.6-1-1-2-.9-2-.4-1-.9-2-.5-1-.4-1-.8-2-.3-1-.4-1-.9-2-.5-1-.6-1-.5-1-1-2-.5-1-.4-1-.8-2-.8-2-.5-1-.6-1-.7-1-1.3-2-.6-1-.5-1-.5-1-1-2-1.2-2-.7-1-1.3-2-1.4-2-1.5-2-1.8-1.6-1-.8-2-1.4-1-.8-2-1.1-1-.5-1-.5-2-.9-2-.5-1-.3-2-.6-1-.4-2-.9-1-.5-1-.3-1-.5-1-.2-1-.3-2-.5-1-.3-2-.5-2-.8-1-.4-1-.4-2-.6-1-.3-1-.2-2-.5-2-.3-1-.2-2-.3-1-.2-1-.3-1-.2-1-.3-1-.2-2-.3h-1l-1-.1h-3l-2-.4-1-.2-2-.3h-1l-2-.1h-17l-2-.4-1-.2-2-.3h-1l-1-.1h-7l-2 .4-1 .2-2 .3-2 .1h-12l-2 .4-1 .2-1 .3-1 .2-2 .5-1 .2-2 .2h-1l-2 .4-2 .4-1 .1-2 .2-2 .3-2 .4-1 .1-2 .3-1 .2-1 .3-2 .6-1 .3-1 .2-2 .3-2 .3-1 .2-1 .2-2 .4-1 .2-1 .2-2 .3-1 .2-2 .3-1 .3-1 .3-2 .7-1 .3-2 .6-1 .3-1 .2-2 .5-2 .4-2 .4-1 .3-1 .3-2 .7-1 .3-2 .6-1 .3-1 .3-1 .2-2 .9-1 .5-1 .4-1 .5-2 1-1 .3-1 .3-1 .4-2 .6-2 .7-1 .4-2 .9-1 .5-1 .4-1 .4-1 .4-2 .6-2 .6-1 .2-2 .9-1 .5-1 .4-1 .5-2 1-2 .7-2 .9-2 1-1 .5-1 .4-1 .4-2 .8-1 .5-2 1.1-2 1-1 .5-2 .5-2 .7-2 1.2-1 .7-2 1.2-1 .4-2 1-1 .6-1 .4-1 .6-1 .4-1 .6-1 .4-1 .6-2 1-1 .4-1 .4-2 1-1 .7-2 1.5-1 .8-2 1.4-2 1.2-1 .5-1 .5-2 1.3-1 .8-1 .8-2 1.8-2 1.6-1 .7-2 1.2-2 1.5-1 .7-1 .8-2 1.7-2 1.8-2 1.7-1 .8-1 .8-2 1.6-1 .8-1 .8-2 1.7-1 1-2 1.9-1 1-2 2-2 2-2 1.6-1 .8-1 .7-1 .8-1 .7-1 .8-2 1.7-1 1-1.7 1.9-.7 1-1.2 2-1.5 2-1.8 2-1.6 2-.7 1-1.2 2-.7 1-1.3 2-.9 2-.3 1-.2 1v2l.2 2 .2 1 .2 1 .1 1 .1 2v1l.4 2 .3 1 .6 2 .3 1 .5 2 .3 1 .2 1 .3 2 .2 2 .3 2 .4 2 .2 1 .4 2 .3 1 .6 2 .5 2 .4 2 .4 2 .3 2 .2 1 .3 2 .3 1 .3 1 .7 2 .3 1 .6 2 .5 2 .3 1 .3 1 .3 1 .3 1 .7 2 .3 1 .3 1 .5 2 .3 1 .2 1 .2 1 .4 2 .2 1 .3 1 .7 2 .4 1 .8 2 .5 2 .3 1 .2 1 .3 2 .2 1 .4 2 .8 2 .5 1 .7 2 .3 1 .4 2 .3 1 .8 2 .4 1 .4 1 .5 1 .2 1 .3 1 .3 1 .6 2 .3 1 1 3 .7 2 .6 2 .2 1 .4 2 .4 2 .3 2 .1 1 .1 1v2l-.4 2-.4 1-1 2-1.2 2-.7 1-1.6 2-1.6 2-.8 1-.8 1-.7 1-1.5 2-1.2 2-.6 1-1.5 2-.7 1-1.4 2-.7 1-1.3 2-1.3 2-.7 1-.6 1-.6 1-1.2 2-.8 1-1.4 2-.7 1-1.4 2-.7 1-.7 1-1.5 2-.7 1-.7 1-1.4 2-.8 1-1.6 2-1.5 2-1.4 2-.6 1-.7 1-1.4 2-.7 1-1.5 2-.6 1-1.3 2-.7 1-1.6 2-.7 1-1.3 2-.4 1-.6 1-.5 1-.6 1-.5 1-1.5 2-.7 1-.8 1-1.6 2-1.6 2-1.4 2-.7 1-.7 1-1.5 2-.7 1-.7 1-1.4 2-1.4 2-.7 1-.8 1-1.2 2-.5 1-1.2 2-.7 1-1.6 2-.8 1-1.4 2-1.2 2-.6 1-.6 1-1.2 2-.6 1-1.2 1.8-1.4 1.6-.8.8-1.1 1.8-.5 1-1.3 2-1.6 2-.8 1-1.6 2-.7 1-1.2 2-1.4 2-.7 1-1.1 2-1 2-.9 2-.4 1-.8 2-.3 1-.4 1-.4 1-.4 1-.4 1-.8 2-.8 2-.3 1-.5 2-.3 2v2l.3 2 .7 2 1 2 .6.9 1.7 1.4 2 .6h1l1 .1h5l2-.4 1-.2 1-.2 2-.4 1-.2 2-.7 1-.5 1-.5 2-1 2-.9 1-.4 2-.9 1-.4 2-1 1-.3 2-1 1-.5 2-1.3 1-.8 2-1.2 1-.6 2-1.2 1-.5 2-1 2-1.2 2-1.6 2-1.6 1-.6 1-.6 1-.6 1.8-1.2.8-.8 1.6-1.6.9-.9 1-.8.9-.7 2-1.4 1-.7 1-.8 2-1.6 1-.8 2-1.4 1-.6 1-.5 1.5-.6 1.5-.3m142 43h1.5l1.6.5 1.9 1 2 1.3 1 .8 1 .6 1 .6 2 1.4 1 .9 1 1 2 1.8 1 .9 2 1.6 1 .7 1 .8 2 1.5 1 .7 1 .8 2 1.5 2 1.6 2 1.5 1 .7 2 1.3 1 .8.8.8.8.9 1.6 1.8.9.8.9.7 1.8 1.4.8.7.8.7 1.7 1.5 1 .8 1.9 1.7 1 1 1 .9 2 2 2 2 1 1 2 2 .8 1 1.5 1.8.7.8 1.4 1.6.8.9 1.6 1.9 1.4 2 .6 1 .6 1 1.5 1.6.7.8 1.6 1.7.9 1 .8.9 1.7 2 .7 1 1.4 2 .7 1 .8 1 .9 1 1.9 2 1 1 2 2 1 1 1.6 2 .8 1 1.7 1.6 1 .8 1.9 1.7 2 1.9 1 1 2 2 1 1 2 1.6 2 1.6 1 .9 2 1.9 1 1 2 1.6 2 1.6.8.9 1.6 1.9.8 1 .9.8 1.9 1.6 2 1.6 2 1.6 1 .8 1 .8 2 1.6 1.9 1.5.8.9.5.4.8 1.4-1.5.7-1.6.2-1.9-.3-2-.7-2-1-1-.5-2-1.1-1-.5-2-1.2-2-1.2-2-1.1-1-.4-1-.5-2-.5-1-.3-2-.6-1-.4-1-.5-2-1.1-1-.6-2-1.2-1-.6-2-1.4-1-.7-2-1-2-1-1-.4-2-1.1-1-.6-2-1.2-1-.6-2-1.2-2-1.1-1-.5-1-.6-1-.4-1-.6-1-.5-2-1-1-.7-2-1.4-2-1.5-1-.7-1-.7-2-1.4-1-.7-1-.7-2-1.5-1-.6-2-1.3-1-.8-1-.8-2-1.8-2-1.7-1-.7-2-1.4-1-.7-1-.7-2-1.5-2-1.4-1-.7-2-1.3-1-.7-.8-.7-1.6-1.5-.8-.7-1.6-1.6-.8-.8-1.6-1.5-.9-.7-1.9-1.3-2-1.5-2-1.6-2-1.6-2-1.6-.8-.8-1.6-1.4-.8-.7-.9-.7-1.9-1.6-1-.8-1.8-1.6-.8-.7-1.6-1.5-.9-.8-1.9-1.7-1-1-.8-.9-1.6-1.9-.8-.8-.9-.7-1.9-1.2-1-.7-1-.8-1-1-2-1.9-1-1-2-1.6-1-.8-2-1.7-1.6-1.9-.8-1-1.7-2-1.9-2-1-1-2-2-2-2-1.5-2-1.3-2-.7-1-1.5-1.6-1.6-1.6-1.5-1.8-1.5-2-.8-1-1.7-2-1.8-2-.9-1-1.6-2-.8-1-1.6-2-.8-1-.8-1-1.7-2-.8-1-1.7-2-.7-1-1.4-2-1.3-2-.6-1-.6-1-.6-1-.6-1-1.3-2-.7-1-1.7-2-1.9-2-1-1-1.6-2-.7-.8-.7-.8-1.4-1.6-.8-.9-1.6-1.9-1.6-2-.8-1-1.6-2-.7-1-1.3-2-.7-1-1.6-2-.9-1-1.8-2-1.6-2-.8-.8-.9-.8-.8-.8-1.7-1.7-1.3-1.9-.5-1-.3-1-.2-1v-2l.2-1.5.7-1.5 1.5.3 1.6.3.9.3 1 .3 1 .2 2 .9 1 .5 1 .4 1 .6 1 .4 1 .6 1 .6 2 1.3 1 .7 2 1.7 1 .8 2 1.7 1 .8 2 1.7 1 1 2 1.8 1.8 1.7.8.8 1.4 1.7 1.4 1.9.8 1 .9 1 1.9 2 1 1 1.6 2 .8 1 1.5 2 .7 1 .8 1 1.7 1.6 1.9 1.5 1 .8 2 1.5 2 1.7 1 1 2 1.9 1 1 2 2 2 2 2 1.6 1 .8 2 1.5.8.7 1.6 1.4.8.7.9.7 1.9 1.6 2 1.6 1 .8 1.6 1.6 1.6 1.6 1.8 1.5 1 .8 1 .7 2 1.4 2 1.3 1 .7 1.9 1.4.8.8 1 1.3.3 1.5m132 119l-1 1 1-1z"
    />
  </svg>
);

export const Female: React.FC<Props> = ({
  height = 224,
  tailwindColor = `flprimary`,
  style = {},
}) => (
  <svg
    height={height}
    width={34182.4 / height}
    viewBox="0 0 1098 1600"
    style={{
      ...style,
      transform: style.transform ? `${style.transform} scaleX(-1)` : `scaleX(-1)`,
    }}
  >
    <path
      className={cx(`text-${tailwindColor} fill-current`)}
      d="M1029 1372c-10-76-43-158-87-221-22-32-55-58-75-91-9-15-6-30-12-45-5-13-21-16-25-27-4-9 2-21-2-30-2-6-9-22-13-26-3-4-11-4-13-9-2-8 3-16 0-24-5-10-21 0-28-7-12-13-11-47-13-63-1-14-5-46 3-58 7-9 22-9 28-21 4-8-19-18-13-29 8-13 35-25 47-35 23-19 45-46 60-71 51-82 37-174 24-264-5-37-13-85-39-114-20-21-45-38-67-57-37-29-72-59-115-80-27-13-54-30-84-19-38 14-78 48-108 74-15 14-30 37-50 43-57 17-112 31-164 62-29 17-51 42-77 61-20 15-56 18-69 42-4 8 6 18 5 26-4 24-22 40-19 67 2 11 14 16 17 26 7 26 7 60 9 87 1 9 6 21 5 30-1 7-11 4-11 8-1 6 7 8 6 14-3 14-14 28-20 41-8 17-11 36-18 53-6 14-22 31-17 48 7 28 53 12 68 32 14 18 3 39 10 57 4 9 15 8 21 15 5 5-2 13 1 20 5 11 20 11 22 25 4 23-29 59 0 75 27 15 51 2 79 0 15 0 28 7 43 5 10-2 28-13 38-11 6 2 1 10 3 13 3 4 19 16 23 18 9 4 12-7 19-9 7-3 13 14 15 19 10 37 10 77 22 114 4 12 19 40 16 52-3 9-13 15-19 21-16 16-30 34-47 49-51 48-105 97-143 156-25 39-53 77-71 120-2 6-19 37-12 41 5 4 14-8 17-11 15-15 31-30 45-46 60-65 141-106 219-146 99-50 203-96 313-115 54-9 110-13 161 8 30 13 48 50 66 75 6 10 14 28 26 32m-463-296l-1 1 1-1z"
    />
  </svg>
);