import React from 'react';
import { cn } from '@/lib/utils';

export interface WarningBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const WarningBox: React.FC<WarningBoxProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'mb-4 p-2 bg-yellow-100 text-yellow-800 rounded',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
