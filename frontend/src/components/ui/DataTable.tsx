import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({ columns, data, onRowClick }: DataTableProps<T>) {
    return (
        <div className="w-full overflow-x-auto bg-surface border border-border">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border bg-bg-primary">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={`py-3 px-4 text-micro uppercase tracking-wider text-text-secondary font-semibold ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`border-b border-border last:border-0 hover:bg-surface-raised transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                        >
                            {columns.map((col, idx) => (
                                <td key={idx} className={`py-4 px-4 text-body text-text-primary whitespace-nowrap ${col.className || ''}`}>
                                    {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor as keyof T] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
