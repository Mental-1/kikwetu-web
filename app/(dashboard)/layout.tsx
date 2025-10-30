// Dashboard pages now handle their own Header and Sidebar
// This layout just passes through children
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
