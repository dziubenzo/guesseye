'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

type ThemeToggleProps = {
  type: 'header' | 'menu';
};

export default function ThemeToggle({ type }: ThemeToggleProps) {
  const { setTheme } = useTheme();

  return (
    <div
      className={`absolute ${type === 'menu' ? 'right-2 top-2' : 'right-0 top-0'}`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={type === 'menu' ? 'ghost' : 'default'}
            size="icon"
            className="cursor-pointer"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTheme('light')}
          >
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTheme('dark')}
          >
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTheme('system')}
          >
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
