import { Theme, useTheme } from '@/config/theme-provider';
import { Button } from '@/ui/button';
import * as D from '@/ui/dropdown-menu';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { cva } from 'class-variance-authority';

const itemStyles = cva('cursor-pointer transition-colors', {
  variants: {
    isSelected: {
      true: 'bg-accent text-accent-foreground',
      false: 'hover:bg-accent',
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

const THEME_CHANGE_DELAY_MS = 200;

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && isThemeChanging) {
      setTimeout(() => {
        setIsOpen(false);
        setIsThemeChanging(false);
      }, THEME_CHANGE_DELAY_MS);
    } else {
      setIsOpen(open);
    }
  };

  const handleItemClick = (selectedTheme: Theme) => {
    setIsThemeChanging(true);
    setTheme(selectedTheme);
  };

  return (
    <D.Menu open={isOpen} onOpenChange={handleOpenChange}>
      <D.MenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className={`transition-colors ${isOpen ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </D.MenuTrigger>
      <D.MenuContent align='end'>
        {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
          <D.MenuItem
            key={themeOption}
            onClick={() => handleItemClick(themeOption)}
            className={itemStyles({ isSelected: theme === themeOption })}
            disabled={theme === themeOption}
          >
            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
          </D.MenuItem>
        ))}
      </D.MenuContent>
    </D.Menu>
  );
}
