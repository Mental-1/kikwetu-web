interface ListingDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Listing Details - {params.id}
        </h1>
        <div className="text-gray-600 dark:text-gray-400">
          Listing details page content will be implemented here
        </div>
      </main>
    </div>
  );
}
