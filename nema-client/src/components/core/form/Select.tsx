export interface SelectOption {
  key: string;
  value: string;
}

interface SelectProps {
  className?: string;
  name?: string;
  label: string;
  id: string;
  options: SelectOption[];
  onChange: (key: string) => void;
}

export default function Select({ id, name, label, className, options, onChange }: SelectProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <select
          id={id}
          name={name}
          autoComplete="country-name"
          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
