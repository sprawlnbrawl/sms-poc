import React, {useState, useRef, useEffect} from 'react';
import { MoreHorizontal } from 'lucide-react';

// Input Component
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

// Select Component
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';

// Dialog Components
export const Dialog = ({ 
    children, 
    open, 
    onOpenChange,
    ...props 
  }: React.HTMLAttributes<HTMLDivElement> & { 
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => {
    if (!open) return null;
    
    return <div {...props}>{children}</div>;
  };
  export const DialogContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    // Find the closest Dialog parent
    const dialogProps = (props as any)['data-dialog-props'] || {};
    const { onOpenChange } = dialogProps;
    
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && onOpenChange) {
        onOpenChange(false);
      }
    };
    
    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`} 
        onClick={handleBackdropClick}
        {...props}
      >
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  };

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`} {...props} />
);

export const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={`text-lg font-semibold ${className}`} {...props} />
);

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-4 flex justify-end space-x-2 ${className}`} {...props} />
);

// Table Components
export const Table = ({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto">
    <table className={`w-full border-collapse text-sm ${className}`} {...props} />
  </div>
);

export const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`bg-gray-100 ${className}`} {...props} />
);

export const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`${className}`} {...props} />
);

export const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={`border-b border-gray-200 px-4 py-3 text-left font-medium text-gray-900 ${className}`} {...props} />
);

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`border-b border-gray-200 ${className}`} {...props} />
);

export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-4 py-3 ${className}`} {...props} />
);

// Badge Component
export const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold ${className}`}
    {...props}
  />
);

