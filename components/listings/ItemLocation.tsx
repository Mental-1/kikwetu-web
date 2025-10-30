import { MapPin } from 'lucide-react';

interface ItemLocationProps {
  location: string;
}

export default function ItemLocation({ location }: ItemLocationProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Location</h3>
      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video mb-3 relative">
        {/* Map Placeholder - Replace with actual map component */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Map View</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        {location}
      </p>
    </div>
  );
}
