import React from 'react';
import cx from 'classnames';
import type { Props as TestimonialProps } from './Testimonial';
import Testimonial from './Testimonial';

interface Props {
  testimonials: Omit<TestimonialProps, `color`>[];
}

const TestimonialsBlock: React.FC<Props> = ({ testimonials }) => {
  const num = testimonials.length;
  if (num > 4) {
    throw new Error(`Too many testimonials!`);
  }

  if (num < 1) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap">
      {testimonials.map((t, idx) => (
        <Testimonial
          className={cx(`flex-grow md:py-20`, {
            'md:w-full': idx === 0 && num === 3,
            'md:w-1/2': num !== 3 || idx !== 0,
          })}
          isFullWidth={(idx === 0 && num === 3) || num === 1}
          key={t.source}
          color={color(idx)}
          text={t.text}
          source={t.source}
        />
      ))}
    </div>
  );
};

export default TestimonialsBlock;

function color(index: number): TestimonialProps[`color`] {
  switch (index) {
    case 0:
      return `maroon`;
    case 1:
      return `blue`;
    case 2:
      return `green`;
    default:
      return `gold`;
  }
}
