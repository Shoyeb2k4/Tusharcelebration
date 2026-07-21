import { requireUser } from '@/lib/auth/session';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar permissions={user.permissions} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 bg-muted/20 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
