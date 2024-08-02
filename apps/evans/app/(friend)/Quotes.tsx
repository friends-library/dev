import React from 'react';
import cx from 'classnames';

const Quotes: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cx(`w-[130px] h-[74px] absolute md:w-[169px] md:h-[100px]`, className)}
    viewBox="0 0 248 158"
  >
    <defs>
      <path
        id="quote"
        className="text-flgreen-800"
        fill="currentColor"
        d="M1269,302.476554 C1269,270.731863 1241.31934,245 1207.16851,245 C1173.01768,245 1148.23566,269.840073 1145.33762,301.474416 C1140.92545,349.737493 1180.3624,390.146736 1228.24818,403 C1211.92408,393.829312 1200.5445,377.873924 1198.64004,359.311288 C1201.43172,359.685148 1204.25896,359.938075 1207.157,359.938075 C1241.31873,359.94907 1269,334.218317 1269,302.472781 L1269,302.476554 Z"
        transform="matrix(-1 0 0 1 1269 -245)"
      />
    </defs>
    <use xlinkHref="#quote" />
    <use xlinkHref="#quote" x="129" />
  </svg>
);

export default Quotes;
