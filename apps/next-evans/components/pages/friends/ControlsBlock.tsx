import React from 'react';
import cx from 'classnames';
import { t, translate } from '@friends-library/locale';
import PillDropdown from '@/components/core/PillDropdown';
import PillDropdownDropdown from '@/components/core/PillDropdownDropdown';
import PillDropdownItem from '@/components/core/PillDropdownItem';
import SearchInput from '@/components/core/SearchInput';

interface Props {
  sortOption: string;
  setSortOption(option: string): unknown;
  searchQuery: string;
  setSearchQuery(query: string): unknown;
}

const ControlsBlock: React.FC<Props> = ({
  sortOption,
  setSortOption,
  searchQuery,
  setSearchQuery,
}) => (
  <div
    id="ControlsBlock"
    className="bg-flgray-100 p-6 pb-12 md:p-8 flex flex-col md:flex-row justify-center items-center"
  >
    <Label>{t`Sort`}</Label>
    <PillDropdown pillText={translate(sortOption)}>
      <PillDropdownDropdown>
        <PillDropdownItem
          onClick={() => setSortOption(`First Name`)}
          selected={sortOption === `First Name`}
        >
          {t`First Name`}
        </PillDropdownItem>
        <PillDropdownItem
          onClick={() => setSortOption(`Last Name`)}
          selected={sortOption === `Last Name`}
        >
          {t`Last Name`}
        </PillDropdownItem>
        <PillDropdownItem
          onClick={() => setSortOption(`Birth Date`)}
          selected={sortOption === `Birth Date`}
        >
          {t`Birth Date`}
        </PillDropdownItem>
        <PillDropdownItem
          onClick={() => setSortOption(`Death Date`)}
          selected={sortOption === `Death Date`}
        >
          {t`Death Date`}
        </PillDropdownItem>
      </PillDropdownDropdown>
    </PillDropdown>
    <Label className="mt-4 md:mt-0 md:ml-10">{t`Search`}</Label>
    <SearchInput query={searchQuery} setQuery={setSearchQuery} />
  </div>
);

export default ControlsBlock;

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={cx(
      className,
      `h-12 flex flex-col justify-center mr-4`,
      `uppercase font-sans text-flgray-500 tracking-wide text-base`,
    )}
  >
    {children}
  </div>
);
