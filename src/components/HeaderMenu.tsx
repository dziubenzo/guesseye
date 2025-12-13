'use client';

import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { signOut } from '@/lib/auth-client';
import {
  ArrowBigLeft,
  ArrowBigUp,
  ChartNoAxesCombined,
  ChartSpline,
  DatabaseZap,
  Dices,
  GalleryHorizontalEnd,
  LogOut,
  Presentation,
  Settings,
  ShieldHalf,
  Shuffle,
  Table,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CUSTOM_TRIGGER_CLASS =
  'bg-primary text-primary-foreground data-[state=open]:bg-primary/90 data-[state=open]:text-primary-foreground data-[state=open]:hover:bg-primary/90 data-[state=open]:hover:text-primary-foreground data-[state=closed]:hover:bg-primary/90 data-[state=closed]:hover:text-primary-foreground data-[state=closed]:bg-primary data-[state=closed]:text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus-visible:bg-primary focus:bg-primary focus-visible:text-primary-foreground focus:text-primary-foreground data-[state=open]:focus:bg-primary min-w-full w-full sm:min-h-10 sm:h-10';

const CUSTOM_MENU_CLASS = 'grid w-[280px] sm:w-[420px] gap-2 sm:gap-4';

type HeaderMenuProps = {
  username: string;
  role: string;
};

export default function HeaderMenu({ username, role }: HeaderMenuProps) {
  const router = useRouter();

  async function logOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          router.refresh();
        },
      },
    });
  }

  return (
    <header className="flex justify-center relative w-full">
      <Logo location="header" />
      <NavigationMenu viewport={true} className="z-2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={CUSTOM_TRIGGER_CLASS}>
              <div className="sm:hidden">
                <Dices />
              </div>
              <div className="hidden sm:block">Games</div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className={CUSTOM_MENU_CLASS}>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/">
                      <div className="flex gap-4 items-center">
                        <ArrowBigUp className="min-w-4 max-w-4" />
                        <div>
                          <div className="font-medium">
                            Current Official Game
                          </div>
                          <div className="text-muted-foreground">
                            Play the current official game.
                          </div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/official">
                      <div className="flex gap-4 items-center">
                        <ArrowBigLeft className="min-w-4 max-w-4" />
                        <div>
                          <div className="font-medium">
                            Previous Official Games
                          </div>
                          <div className="text-muted-foreground">
                            Browse, play, or resume all previous official games.
                          </div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/random">
                      <div className="flex gap-4 items-center">
                        <Shuffle className="min-w-4 max-w-4" />
                        <div>
                          <div className="font-medium">Random Game</div>
                          <div className="text-muted-foreground">
                            Play or resume a random game.
                          </div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={CUSTOM_TRIGGER_CLASS}>
              <div className="sm:hidden">
                <Table />
              </div>
              <div className="hidden sm:block">Leaderboard</div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className={CUSTOM_MENU_CLASS}>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/leaderboard">
                      <div className="flex gap-4 items-center">
                        <Presentation className="min-w-4 max-w-4" />
                        <div>
                          <div className="font-medium">Leaderboard</div>
                          <div className="text-muted-foreground">
                            Browse the leaderboard.
                          </div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/history">
                      <div className="flex gap-4 items-center">
                        <GalleryHorizontalEnd className="min-w-4 max-w-4" />
                        <div>
                          <div className="font-medium">
                            Official Games History
                          </div>
                          <div className="text-muted-foreground">
                            Discover winners of previous official games.
                          </div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={CUSTOM_TRIGGER_CLASS}>
              <div className="sm:hidden">
                <ChartSpline />
              </div>
              <div className="hidden sm:block">Stats</div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className={CUSTOM_MENU_CLASS}>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/stats">
                      <div className="flex gap-4 items-center">
                        <ChartNoAxesCombined className="min-w-4 max-w-4" />
                        <div>
                          <div className="font-medium">Game Stats</div>
                          <div className="text-muted-foreground">
                            Discover your game stats as well as global game
                            stats.
                          </div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/database">
                      <div className="flex gap-4 items-center">
                        <DatabaseZap className="min-w-4 max-w-4" />
                        <div>
                          <div className="font-medium">Database Stats</div>
                          <div className="text-muted-foreground">
                            Take a look at database stats and find out which
                            darts players have their birthday today.
                          </div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={CUSTOM_TRIGGER_CLASS}>
              <div className="sm:hidden">
                <Settings />
              </div>
              <div className="hidden sm:block">My Account</div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className={CUSTOM_MENU_CLASS}>
                <li className="p-2">
                  <p className="text-sm text-center">
                    Hi, <span className="font-medium">{username}</span>!
                  </p>
                  <div className="sm:hidden">
                    <ThemeToggle type="menu" />
                  </div>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/settings">
                      <div className="flex gap-4 items-center">
                        <Settings className="min-w-4 max-w-4" />
                        <div>
                          <div className="font-medium">Settings</div>
                          <div className="text-muted-foreground">
                            Access various account settings.
                          </div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  {role === 'admin' && (
                    <NavigationMenuLink asChild>
                      <Link href="/admin">
                        <div className="flex gap-4 items-center">
                          <ShieldHalf className="min-w-4 max-w-4" />
                          <div>
                            <div className="font-medium">Admin Page</div>
                            <div className="text-muted-foreground">
                              Go to Admin page.
                            </div>
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  )}
                  <NavigationMenuLink asChild>
                    <Button
                      className="cursor-pointer w-full flex flex-row gap-2 items-center justify-end"
                      variant={'ghost'}
                      onClick={logOut}
                    >
                      <LogOut />
                      <p>Log Out</p>
                    </Button>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="hidden sm:block sm:absolute sm:right-0 sm:top-0">
        <ThemeToggle type="header" />
      </div>
    </header>
  );
}
