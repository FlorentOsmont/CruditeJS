import React from "react";
import { Check, X, Pencil, Trash2 } from "lucide-react";
import { Column } from "../types";

interface DataTableProps {
    columns: Column[];
    data: Record<string, any>[];
}

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-200 border-gray-300 sticky top-0">
                            {columns.map((col, colIndex) =>
                                col.visible ? (
                                    <th
                                        key={colIndex}
                                        className="text-left px-5 py-3 font-semibold text-gray-700 text-1xl last:text-right border-b border border-gray-300 border-t-0 first:border-l-0 last:border-r-0"
                                    >
                                        {col.label}
                                    </th>
                                ) : null
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                colSpan={columns.filter((col) => col.visible).length}
                                className="text-center p-8"
                            >
                                Aucune donnée disponible.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    const renderCell = (row: Record<string, any>, column: Column) => {
        const value = row[column.key];
        switch (column.type) {
            case "boolean":
                return value ? <Check size={20} /> : <X size={20} />;
            case "date":
                return value ? new Date(value).toLocaleDateString() : "-";
            case "actions":
                return (
                    <div className="flex align-center justify-end gap-4">
                        <Pencil size={20} className="cursor-pointer" />
                        <Trash2 size={20} className="cursor-pointer" />
                    </div>
                );
            default:
                return value;
        }
    };

    return (
        <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200 border-gray-300 sticky top-0">
                        {columns.map((col, colIndex) =>
                            col.visible ? (
                                <th
                                    key={colIndex}
                                    className="text-left px-5 py-3 font-semibold text-gray-700 text-1xl last:text-right border-b border border-gray-300 border-t-0 first:border-l-0 last:border-r-0"
                                >
                                    {col.label}
                                </th>
                            ) : null
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b last:border-b-0 bg-gray-100 border-gray-300 hover:bg-gray-200"
                        >
                            {columns.map((col, colIndex) =>
                                col.visible ? (
                                    <td
                                        key={`${colIndex}${rowIndex}`}
                                        className="text-left px-4 py-2 font-medium text-gray-700 text-1xl last:text-right border-l border-r border-gray-300 first:border-l-0 last:border-r-0"
                                    >
                                        {renderCell(row, col)}
                                    </td>
                                ) : null
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
