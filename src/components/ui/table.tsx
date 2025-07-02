import React from "react";

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className = "", ...props }) => (
  <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props} />
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = "", ...props }) => (
  <thead className={className} {...props} />
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = "", ...props }) => (
  <tbody className={className} {...props} />
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className = "", ...props }) => (
  <tr className={className} {...props} />
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className = "", ...props }) => (
  <td className={`px-4 py-2 border-b ${className}`} {...props} />
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className = "", ...props }) => (
  <th className={`px-4 py-2 border-b font-bold text-left ${className}`} {...props} />
); 