import Header from '@/components/navigation/Header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={false} />
      {children}
    </div>
  );
}
