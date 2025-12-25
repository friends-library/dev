import React from 'react';
import cx from 'classnames';

export interface Props {
  text: string;
  source: string;
  color: `green` | `blue` | `maroon` | `gold`;
  className?: string;
  isFullWidth?: boolean;
}

const Testimonial: React.FC<Props> = ({
  text,
  source,
  color,
  className,
  isFullWidth = false,
}) => (
  <blockquote
    className={cx(
      className,
      `flex justify-center text-white text-lg font-serif antialiased p-12`,
      {
        'bg-flgreen': color === `green`,
        'bg-flblue': color === `blue`,
        'bg-flmaroon': color === `maroon`,
        'bg-flgold': color === `gold`,
      },
    )}
  >
    <div
      className={cx(
        `p-8 bg-white/5 rounded-xl`,
        isFullWidth && `md:max-w-2xl lg:max-w-3xl`,
        !isFullWidth && `lg:max-w-lg`,
      )}
    >
      <p
        dangerouslySetInnerHTML={{
          __html: `&ldquo;${text.replace(/“/g, `‘`).replace(/”/g, `’`)}&rdquo;`,
        }}
      />
      <cite className="not-italic font-sans mt-4 block font-bold tracking-tight">
        &mdash; {source}
      </cite>
    </div>
  </blockquote>
);

export default Testimonial;
