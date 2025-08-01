import Link from 'next/link';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <nav className="ml-8 flex items-center space-x-4 lg:space-x-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center text-sm font-medium text-foreground/80 hover:text-foreground">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          {/* History link removed as Firebase history is disabled */}
        </nav>
        <div className="ml-auto">
          {/* AuthButton removed */}
        </div>
      </div>
    </header>
  );
};

export default Header;
