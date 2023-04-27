interface FormProps {
  heading: string;
  infoText: string;
  children: React.ReactNode;
  onSave: (event: React.MouseEvent) => void;
  onCancel?: () => void;
}

export default function Form(props: FormProps) {
  return (
    <form className="w-full">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          {props.heading && <h2 className="text-base font-semibold leading-7 text-gray-900">{props.heading}</h2>}
          {props.infoText && <p className="mt-1 text-sm leading-6 text-gray-600">{props.infoText}</p>}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">{props.children}</div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {props.onCancel && (
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
        )}
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={props.onSave}
        >
          Save
        </button>
      </div>
    </form>
  );
}
