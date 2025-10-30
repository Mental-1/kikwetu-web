import { Shield } from 'lucide-react';

export default function SafetyTips() {
  const tips = [
    'Meet in a public place.',
    'Check the item before you buy.',
    'Pay only after collecting the item.'
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-orange-500" />
        Safety Tips
      </h3>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
