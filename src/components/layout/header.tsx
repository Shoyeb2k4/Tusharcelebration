import { Bell } from 'lucide-react';
import type { SessionUser } from '@/lib/auth/session';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { MobileNav } from './mobile-nav';
import { GlobalSearch } from './global-search';
import { UserMenu } from './user-menu';

export function Header({ user }: { user: SessionUser }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur lg:px-6">
      <MobileNav permissions={user.permissions} />
      <GlobalSearch />
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <div className="ml-1">
          <UserMenu
            fullName={user.fullName}
            email={user.email}
            roleName={user.roleName}
            avatarUrl={user.avatarUrl}
          />
        </div>
      </div>
    </header>
  );
}
