import React from 'react';
import cx from 'classnames';

interface Props {
  tailwindColor?: string;
  className?: string;
  height?: number;
}

const GlobeIcon: React.FC<Props> = ({
  tailwindColor = `white`,
  className,
  height = 40,
}) => {
  return (
    <svg
      className={cx(className, `inline-block`)}
      width={height}
      height={height}
      viewBox="0 0 40 40"
    >
      <path
        className={cx(`text-${tailwindColor}`, `fill-current`)}
        d="M11.6677538,30.4756156 C11.4016379,30.4510022 11.1990058,30.2324353 11.2000085,29.9715315 L11.2000085,9.30408408 C11.2000085,9.02545161 11.4308585,8.8 11.7161409,8.8 L26.6838714,8.8 C26.9691615,8.8 27.2000085,9.02545917 27.2000085,9.30408408 L27.2000085,29.9715315 C27.2000085,30.1576091 27.0941523,30.3299101 26.9258067,30.4175199 C26.756452,30.5051448 26.5518199,30.4933291 26.393549,30.3889686 L19.2000085,25.5449726 L12.0064632,30.3889686 C11.9076736,30.454933 11.7877124,30.4854528 11.6677538,30.475608 L11.6677538,30.4756156 Z M12.2322695,29.0185101 L18.9096837,24.5210719 C19.0850874,24.4039127 19.3149221,24.4039127 19.4903284,24.5210719 L26.1677425,29.0185101 L26.1677425,9.80811776 L12.2322695,9.80811776 L12.2322695,29.0185101 Z"
      />
    </svg>
  );
};

export default GlobeIcon;