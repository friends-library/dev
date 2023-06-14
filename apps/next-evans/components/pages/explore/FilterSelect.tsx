import React from 'react';
import cx from 'classnames';
import { Popover, Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  selected: string[];
  setSelected: (selected: string[]) => any;
}

const FilterSelect: React.FC<Props> = ({ selected, setSelected }) => (
  <Popover className="relative flex flex-col items-center">
    {({ open }) => (
      <>
        <Popover.Button className="border border-flgray-400 rounded-full bg-white w-64 pl-8 pr-4 py-2 flex justify-between items-center">
          <span className="text-flgray-500 tracking-wider text-lg shrink-0">
            All books
          </span>
          <ChevronDownIcon
            className={cx(
              `shrink-0 h-6 text-flgray-500 ml-16 transition duration-200`,
              open ? `-rotate-180` : `rotate-0`,
            )}
          />
        </Popover.Button>
        <Popover.Panel className="border-[0.5px] border-flgray-200 bg-white shadow-xl absolute z-10 p-2 top-14 w-72 rounded-xl overflow:hidden">
          <div className="flex justify-center p-2">
            <h4 className="text-flgray-700">Select one or more filters</h4>
          </div>
          <FilterCategoryAccordion
            selected={selected}
            setSelected={setSelected}
            title="Editions"
            category="edition"
            options={[
              { display: `Updated`, value: `updated` },
              { display: `Modernized`, value: `modernized` },
              { display: `Original`, value: `original` },
            ]}
          />
          <FilterCategoryAccordion
            selected={selected}
            setSelected={setSelected}
            title="Tags"
            category="tag"
            options={[
              { display: `Journal`, value: `journal` },
              { display: `Letters`, value: `letters` },
              { display: `Exhortation`, value: `exhortation` },
              { display: `Doctrinal`, value: `doctrinal` },
              { display: `Treatise`, value: `treatise` },
              { display: `History`, value: `history` },
              { display: `Allegory`, value: `allegory` },
              { display: `Spiritual Life`, value: `spiritual-life` },
            ]}
          />
          <FilterCategoryAccordion
            selected={selected}
            setSelected={setSelected}
            title="Time Period"
            category="period"
            options={[
              { display: `Early (1650-1725)`, value: `early` },
              { display: `Mid (1725-1815)`, value: `mid` },
              { display: `Late (1815-1895)`, value: `late` },
            ]}
          />
          <FilterCategoryAccordion
            selected={selected}
            setSelected={setSelected}
            title="Region"
            category="region"
            options={[
              { display: `England`, value: `England` },
              { display: `Ireland`, value: `Ireland` },
              { display: `Scotland`, value: `Scotland` },
              { display: `Eastern US`, value: `Eastern US` },
              { display: `Western US`, value: `Western US` },
              { display: `Other`, value: `Other` },
            ]}
          />
        </Popover.Panel>
      </>
    )}
  </Popover>
);

export default FilterSelect;

interface AccordionProps {
  title: string;
  category: string;
  options: Array<{ display: string; value: string }>;
  selected: string[];
  setSelected: (selected: string[]) => any;
}

const FilterCategoryAccordion: React.FC<AccordionProps> = ({
  title,
  category,
  options,
  selected,
  setSelected,
}) => (
  <Disclosure>
    {({ open }) => (
      <div className="last:rounded-b-xl flex flex-col overflow:hidden">
        <Disclosure.Button className="font-bold flex justify-between items-center space-x-2 p-4 hover:bg-flgray-100 transition duration-200 rounded-2xl">
          <span className="text-flgray-700 text-lg">{title}</span>
          <ChevronDownIcon
            className={cx(
              `h-5 text-flgray-500 transition duration-100`,
              open ? `-rotate-180` : `rotate-0`,
            )}
          />
        </Disclosure.Button>
        <Disclosure.Panel>
          <ul className="flex flex-col pb-4">
            {options.map((option) => (
              <button
                key={option.value}
                className={cx(
                  `py-2 px-4 rounded-xl text-base text-center hover:bg-flgray-100 border cursor-pointer text-flgray-600 transition duration-100`,
                  selected.includes(`${category}.${option.value}`)
                    ? `border-flgray-400 bg-flgray-100`
                    : `border-transparent`,
                )}
                onClick={() => {
                  if (selected.includes(`${category}.${option.value}`)) {
                    return setSelected(
                      selected.filter((s) => s !== `${category}.${option.value}`),
                    );
                  }
                  if (
                    selected.map((s) => s.split(`.`)[0]).includes(category) &&
                    category !== `tag`
                  ) {
                    return setSelected([
                      ...selected.filter((s) => s.split(`.`)[0] !== category),
                      `${category}.${option.value}`,
                    ]);
                  }
                  return setSelected([...selected, `${category}.${option.value}`]);
                }}
              >
                {option.display}
              </button>
            ))}
          </ul>
        </Disclosure.Panel>
      </div>
    )}
  </Disclosure>
);
