import EllipsisDropdown, { EllipsisDropdownItem } from 'components/core/dropdowns/EllipsisDropdown';
import React from 'react';

export interface TableRow {
  columns: string[];
  id: string;
  item: any;
}

export interface TableActions {
  items: EllipsisDropdownItem[];
  onSelect: (key: string, item: any) => void;
}

export interface TableProps {
  heading: string;
  infoText?: string;
  data: TableRow[];
  columnsHeadings: string[];
  columnsWidthPercents: number[];
  onAddNew?: () => void;
  addNewLabel?: string;
  firstColumnBold?: boolean;
  actions?: TableActions;
}
export function Table(props: TableProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center justify-between">
        {props.heading && (
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">{props.heading}</h1>
            {props.infoText && <p className="mt-2 text-sm text-gray-700">{props.infoText}</p>}
          </div>
        )}
        {props.onAddNew && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={props.onAddNew}
            >
              {props.addNewLabel || 'Add New'}
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-visible sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {props.columnsHeadings.map((heading, index) => (
                    <th key={index} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {props.data.map((row, index) => (
                  <tr key={index}>
                    {row.columns.map((cell, index) => {
                      return index === 0 && props.firstColumnBold ? (
                        <td
                          width={`${props.columnsWidthPercents?.[index] || 100}%`}
                          key={index}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 break-all	"
                        >
                          {cell}
                        </td>
                      ) : (
                        <td key={index} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 break-all">
                          {cell}
                        </td>
                      );
                    })}
                    {props.actions && (
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <EllipsisDropdown
                          items={props.actions.items}
                          onSelect={(key) => {
                            props.actions?.onSelect(key, row.item);
                          }}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
