import React from 'react';
import cx from 'classnames';
import FilterBtn from './FilterBtn';
import Dual from '@/components/core/Dual';

interface Filter {
  text: string;
  clear(): unknown;
}

interface Props {
  groups: {
    label: string;
    filters: Filter[];
  }[];
  clearAll(): unknown;
}

const ActiveFilters: React.FC<Props> = ({ groups, clearAll }) => (
  <div className="bg-flgray-300 p-6 flex flex-col">
    <Dual.Span className="text-flgray-500 font-sans tracking-wider uppercase text-center text-base antialiased mb-2">
      <>Active Filters:</>
      <>Filtros Activos:</>
    </Dual.Span>
    <div className={cx(`flex flex-col md:flex-row md:flex-wrap`)}>
      {groups.map((group, index) => (
        <div
          className={cx(
            `border-flgray-400 py-2`,
            index === groups.length - 1 ? `border-b-0` : `border-b md:border-b-0`,
            `md:flex md:flex-wrap md:mx-3`,
          )}
          key={group.label}
        >
          <div className="flex items-center">
            <h5 className="sans-wider antialiased text-right text-flgray-500 mr-1 pr-2 md:pr-0 w-1/4 sm:w-1/5 md:w-auto">
              {group.label}:
            </h5>
            <div className="w-3/4 sm:w-4/5 md:flex md:w-auto">
              {group.filters.map((filter) => (
                <FilterBtn
                  className="m-1 capitalize"
                  key={filter.text}
                  onClick={filter.clear}
                  dismissable
                >
                  {filter.text}
                </FilterBtn>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="hidden md:flex flex-grow xl:flex-grow-0 mt-2 ml-auto justify-center">
        <FilterBtn key="clear-all" onClick={clearAll}>
          <Dual.Frag>
            <>Clear All Filters</>
            <>Borrar todos los Filtros</>
          </Dual.Frag>
        </FilterBtn>
      </div>
    </div>
    <div className="mt-4 flex justify-center md:hidden">
      <FilterBtn key="clear-all" onClick={clearAll}>
        <Dual.Frag>
          <>Clear All Filters</>
          <>Borrar todos los Filtros</>
        </Dual.Frag>
      </FilterBtn>
    </div>
  </div>
);

export default ActiveFilters;
