import ListingCard from '@/components/cards/ListingCard';

interface RelatedItem {
  id: number;
  title: string;
  description: string;
  price: string;
  condition: string;
  location: string;
  views: string;
  image: string;
}

interface RelatedItemsProps {
  items: RelatedItem[];
}

export default function RelatedItems({ items }: RelatedItemsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <ListingCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            price={item.price}
            condition={item.condition}
            location={item.location}
            views={item.views}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
}
