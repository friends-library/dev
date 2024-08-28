import React from 'react';
import cx from 'classnames';
import { Popover, Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  selected: string[];
  setSelected(selected: string[]): unknown;
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
        <Popover.Panel className="border-[0.5px] border-flgray-200 bg-white shadow-xl absolute flex flex-col items-center z-10 top-16 w-72 rounded-xl">
          <div className="border-l-[0.5px] border-t-[0.5px] border-flgray-200 rounded-sm w-5 h-5 rotate-45 bg-white absolute -top-2.5" />
          <div className="flex justify-center p-4">
            <h4 className="text-flgray-600 antialiased italic">
              Select one or more filters...
            </h4>
          </div>
          <div className="relative overflow-hidden rounded-b-xl self-stretch">
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
                { display: `England`, value: `england` },
                { display: `Ireland`, value: `ireland` },
                { display: `Scotland`, value: `scotland` },
                { display: `Eastern US`, value: `eastern-us` },
                { display: `Western US`, value: `western-us` },
                { display: `Other`, value: `other` },
              ]}
            />
          </div>
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
  setSelected(selected: string[]): unknown;
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
        <Disclosure.Button className="bg-flgray-100 flex justify-center items-center space-x-2 p-4 hover:bg-flgray-100 transition duration-200">
          <span className="text-flgray-500 text-lg antialiased">{title}</span>
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
                  `py-2 px-4 text-base text-center border cursor-pointer text-flgray-500 transition duration-100 first:mt-4 antialiased`,
                  selected.includes(`${category}.${option.value}`)
                    ? `bg-flgray-300 hover:bg-flgray-400`
                    : `border-transparent hover:bg-flgray-200`,
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
