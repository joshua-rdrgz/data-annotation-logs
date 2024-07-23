import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { Dot } from 'lucide-react';

import { cn } from '@/lib/utils';

const Root = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      'flex items-center gap-2 has-[:disabled]:opacity-50 w-full',
      containerClassName,
    )}
    className={cn('disabled:cursor-not-allowed w-full', className)}
    {...props}
  />
));
Root.displayName = 'InputOTP';

const Group = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center w-full justify-between', className)}
    {...props}
  />
));
Group.displayName = 'InputOTPGroup';

const Slot = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-12 sm:h-14 w-full items-center justify-center bg-background border-y border-r border-input dark:border-slate-700 transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        'text-lg sm:text-xl',
        isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='h-4 w-px animate-caret-blink bg-foreground duration-1000' />
        </div>
      )}
    </div>
  );
});
Slot.displayName = 'InputOTPSlot';

const Separator = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
  <div ref={ref} role='separator' {...props}>
    <Dot />
  </div>
));
Separator.displayName = 'InputOTPSeparator';

export { Root, Group, Slot, Separator };
