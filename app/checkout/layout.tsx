export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pages handle their own layout with Header
  return <>{children}</>;
}
