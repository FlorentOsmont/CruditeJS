import React, { useEffect, useRef, useState } from 'react';
import { Search, Columns3, ListFilter, Download, Plus, Sheet, FileText, X, Columns } from 'lucide-react';
import { Column } from '../types';

interface FiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    columns: Column[];
    setColumns: (columns: Column[]) => void;
}

const Filters: React.FC<FiltersProps> = ({ searchTerm, setSearchTerm, columns, setColumns }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const columnsMenuRef = useRef<HTMLDivElement>(null);
    const exportMenuRef = useRef<HTMLDivElement>(null);
    const filterMenuRef = useRef<HTMLDivElement>(null);

    const [queryParamsForExport, setQueryParamsForExport] = useState<string>("");

    const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        setQueryParamsForExport(buildQueryParamsWithoutPagination());

        const handleClickOutside = (event: MouseEvent) => {
            if (openMenu === "columns" && columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
            if (openMenu === "export" && exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
            if (openMenu === "filters" && filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenu, columns]);

    const toggleMenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const toggleColumn = (columnKey: string) => {
        setColumns((prevColumns: Column[]) =>
            prevColumns.map(col =>
                col.key === columnKey ? { ...col, visible: !col.visible } : col
            )
        );
    };

    const handleFilterChange = (key: string, newValue: string | { start?: string; end?: string }) => {
        setColumns((prevColumns: Column[]) =>
            prevColumns.map(col =>
                col.key === key ? { ...col, value: typeof newValue === "object" ? { ...col.value, ...newValue } : newValue } : col
            )
        );
    };

    const buildQueryParamsWithoutPagination = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);

        columns.forEach(col => {
            if (col.value) {
                if (col.filter === "dateRange" && typeof col.value === "object") {
                    if (col.value.start) params.append(`${col.key}_start`, col.value.start);
                    if (col.value.end) params.append(`${col.key}_end`, col.value.end);
                } else {
                    params.append(col.key, col.value as string);
                }
            }
        });

        return params.toString();
    };

    return (
        <div className="w-full flex flex-col">
            <div className="flex items-center justify-between">
                {/* Champ de Recherche */}
                <div className="flex mb-2 gap-4">
                    <div className="h-11 flex items-center mb-2 px-2 border border-gray-300 rounded">
                        <Search size="18" color="#62748e" />
                        <input className="pl-2 text-gray-700 bg-transparent focus:outline-none" type="text" onChange={handleSearchTerm} placeholder="Rechercher" />
                    </div>
                </div>
                {/* Filtres, Colonnes, Export & Ajout */}
                <div className="flex mb-2 gap-4">
                    <div className="relative" ref={filterMenuRef}>
                        <div onClick={() => toggleMenu("filters")} className="h-11 flex items-center mb-2 px-2 border border-gray-300 rounded hover:bg-gray-200">
                            <ListFilter size="18" color="#62748e" />
                            <p className="p-2 text-gray-700">Filtres</p>
                        </div>
                        {openMenu === "filters" ?
                            <div className="absolute top-full p-4 rounded left-0 z-10 bg-gray-100 border border-gray-300 shadow-md">
                                {columns.map((col, colIndex) => (
                                    col.filter !== null ?
                                        <div key={`colFilter-${colIndex}`} className="flex flex-col gap-2 px-3 py-1">
                                            <label className="font-md whitespace-nowrap text-gray-700">{col.label}</label>
                                            {col.filter === "text" && (
                                                <input type="text" value={col.value} onChange={(e) => handleFilterChange(col.key, e.target.value)} className=" border border-gray-300 p-2 rounded focus:outline-hidden" />
                                            )}
                                            {col.filter === "choices" && (
                                                <select value={col.value} onChange={(e) => handleFilterChange(col.key, e.target.value)} className="border border-gray-300 p-2 rounded focus:outline-hidden">
                                                    <option value="">Tous</option>
                                                    {col.choices.map((choice, choiceIndex) => (
                                                        <option key={`choice-${choiceIndex}`} value={choice}>
                                                            {choice}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {col.filter === "bool" && (
                                                <select value={col.value} onChange={(e) => handleFilterChange(col.key, e.target.value)} className="border border-gray-300 p-2 rounded">
                                                    <option value="">Tous</option>
                                                    <option value="True">Oui</option>
                                                    <option value="False">Non</option>
                                                </select>
                                            )}
                                            {col.filter === "dateRange" && (
                                                <div className="flex gap-2">
                                                    <input value={col.value.start} onChange={(e) => handleFilterChange(col.key, { start: e.target.value })} type="date" className="border border-gray-300 p-2" />
                                                    <input value={col.value.end} onChange={(e) => handleFilterChange(col.key, { end: e.target.value })} type="date" className="border border-gray-300 p-2" />
                                                </div>
                                            )}
                                        </div>
                                        : null
                                ))}
                            </div>
                            : null}
                    </div>
                    <div className="relative" ref={columnsMenuRef}>
                        <div onClick={() => toggleMenu("columns")} className="h-11 flex items-center mb-2 px-2 border border-gray-300 rounded hover:bg-gray-200">
                            <Columns3 size="18" color="#62748e" />
                            <p className="p-2 text-gray-700">Colonnes</p>
                        </div>
                        {openMenu === "columns" ?
                            <div className="absolute top-full p-4 rounded left-0 z-10 bg-gray-100 border border-gray-300 shadow-md">
                                {columns.map((col, colIndex) => (
                                    <div key={`colVisible-${colIndex}`} className="flex items-center gap-2 p-1">
                                        <input className="flex items-center justify-center h-4 w-4" type="checkbox" checked={col.visible ? "checked" : ""} onChange={() => toggleColumn(col.key)} />
                                        <p className="whitespace-nowrap text-gray-700">{col.label}</p>
                                    </div>
                                ))}
                            </div>
                            : null}
                    </div>
                    <div className="relative" ref={exportMenuRef}>
                        <div onClick={() => toggleMenu("export")} className="h-11 flex items-center mb-2 px-2 border border-gray-300 rounded hover:bg-gray-200">
                            <Download size="18" color="#62748e" />
                            <p className="p-2 text-gray-700">Export</p>
                        </div>
                        {openMenu === "export" ?
                            <div className="flex flex-col gap-4 absolute top-full p-4 rounded left-0 z-10 bg-gray-100 border border-gray-300 shadow-md">
                                <a href={`http://127.0.0.1:8000/api/animals/export-csv/?${queryParamsForExport}`} download className="flex gap-2">
                                    <Sheet size="24" color="#62748e" />
                                    <p className="whitespace-nowrap text-gray-700">Télécharger en CSV</p>
                                </a>
                                <a href={`http://127.0.0.1:8000/api/animals/export-pdf/?${queryParamsForExport}`} download className="flex gap-2">
                                    <FileText size="24" color="#62748e" />
                                    <p className="whitespace-nowrap text-gray-700">Télécharger en PDF</p>
                                </a>
                            </div>
                            : null}
                    </div>
                    <div className="h-11 flex items-center mb-2 px-2 border border-gray-300 rounded hover:bg-gray-200">
                        <Plus size="18" color="#62748e" />
                        <p className="p-2 text-gray-700">Ajouter</p>
                    </div>
                </div>
            </div>
            <div className="flex">
                {columns.map((col, colIndex) => {
                    return (
                        <div key={`filterBulb${colIndex}`} className="flex gap-2">
                            {col.filter === "text" && (col.value && col.value !== "") ?
                                <div className="flex items-center gap-1 mr-2 mb-4 px-2 py-1 border-gray-300 rounded-full hover:cursor-pointer hover:bg-gray-200" onClick={() => handleFilterChange(col.key, "")}>
                                    <X size="16" className="text-gray-700" />
                                    <p className="text-sm pr-1 text-gray-700">{col.label} : {col.value}</p>
                                </div>
                                : ""}
                            {col.filter === "choices" && (col.value && col.value !== "") ?
                                <div className="flex items-center gap-1 mr-2 mb-4 px-2 py-1 border border-gray-300 rounded-full hover:cursor-pointer hover:bg-gray-200" onClick={() => handleFilterChange(col.key, "")}>
                                    <X size="16" className="text-gray-700" />
                                    <p className="text-sm pr-1 text-gray-700">{col.label} : {col.value}</p>
                                </div>
                                : ""}
                            {col.filter === "bool" && (col.value && col.value !== "") ?
                                <div className="flex items-center gap-1 mr-2 mb-4 px-2 py-1 border border-gray-300 rounded-full hover:cursor-pointer hover:bg-gray-200" onClick={() => handleFilterChange(col.key, "")}>
                                    <X size="16" className="text-gray-700" />
                                    <p className="text-sm pr-1 text-gray-700">{col.label} : {col.value}</p>
                                </div>
                                : ""}
                            {col.filter === "dateRange" && (col.value.start && col.value.start !== "") ?
                                <div className="flex items-center gap-1 mr-2 mb-4 px-2 py-1 border border-gray-300 rounded-full hover:cursor-pointer hover:bg-gray-200" onClick={() => handleFilterChange(col.key, { start: "" })}>
                                    <X size="16" className="text-gray-700" />
                                    <p className="text-sm pr-1 text-gray-700">{col.label} après : {new Date(col.value.start).toLocaleDateString()}</p>
                                </div>
                                : ""}
                            {col.filter === "dateRange" && (col.value.end && col.value.end !== "") ?
                                <div className="flex items-center gap-1 mr-2 mb-4 px-2 py-1 border border-gray-300 rounded-full hover:cursor-pointer hover:bg-gray-200" onClick={() => handleFilterChange(col.key, { end: "" })}>
                                    <X size="16" className="text-gray-700" />
                                    <p className="text-sm pr-1 text-gray-700">{col.label} avant : {new Date(col.value.end).toLocaleDateString()}</p>
                                </div>
                                : ""}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Filters;