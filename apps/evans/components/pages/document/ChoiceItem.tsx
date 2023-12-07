import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';

interface Props {
  label: string;
  description: string;
  recommended?: boolean;
  Icon: React.FC;
  onChoose: () => any;
}

const ChoiceItem: React.FC<Props> = ({
  label,
  description,
  recommended,
  Icon,
  onChoose,
}) => (
  <div
    onClick={onChoose}
    className={cx(
      recommended && `bg-flblue-700`,
      `hover:bg-flblue-800 py-4 pl-12 flex cursor-pointer`,
    )}
  >
    <div className="mr-4 p-1" style={{ minWidth: `3rem` }}>
      <Icon />
    </div>
    <div className="pr-6">
      <h6 className="uppercase text-lg font-bold tracking-widest">{label}</h6>
      <p className="text-sm tracking-wide">{description}</p>
      {recommended && (
        <div className="rounded-full text-center text-xs py-1 bg-flblue mt-2 uppercase w-40">
          {t`Recommended`}
        </div>
      )}
    </div>
  </div>
);

export default ChoiceItem;
