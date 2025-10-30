interface SpecificationsProps {
  specs: { label: string; value: string }[];
}

export default function Specifications({ specs }: SpecificationsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
      <ul className="space-y-3">
        {specs.map((spec, index) => (
          <li key={index} className="flex items-start">
            <span className="text-gray-600 min-w-[120px] md:min-w-[150px]">{spec.label}:</span>
            <span className="text-gray-900 font-medium">{spec.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
