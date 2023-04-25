export interface DetailsContainerProps {
  heading: string;
  infoText?: string;
  children: React.ReactNode;
}

export default function DetailsContainer(props: DetailsContainerProps) {
  return (
    <div>
      <div className="px-4 sm:px-0">
        {props.heading && <h2 className="text-base font-semibold leading-7 text-gray-900">{props.heading}</h2>}
        {props.infoText && <p className="mt-1 text-sm leading-6 text-gray-600">{props.infoText}</p>}
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">{props.children}</dl>
      </div>
    </div>
  );
}
