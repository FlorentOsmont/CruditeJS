import React, { useState, useEffect } from 'react';
import Filters from './components/Filters';
import DataTable from './components/DataTable';
import Pagination from './components/Pagination';

interface TableProps {
    config: {
        apiUrl: string;
        pagination: { limit: number, offset: number };
        columns: Array<{
            key: string;
            label: string;
            type: string;
            visible: boolean;
            filter?: string;
            choices?: Array<string>;
            value?: string | boolean | { start: string; end: string };
        }>;
    };
}

const Crudite: React.FC<TableProps> = ({ config }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [columns, setColumns] = useState(config.columns);
    const [rawData, setRawData] = useState<any>([]);
    const [queryOffset, setQueryOffset] = useState(config.pagination.offset);
    const [queryLimit, setQueryLimit] = useState(config.pagination.limit);
    const [queryCount, setQueryCount] = useState(0);

    const buildQueryParams = () => {
        const params = new URLSearchParams();

        params.append("limit", queryLimit.toString());
        params.append("offset", queryOffset.toString());
        if (searchTerm) params.append("search", searchTerm);

        columns.forEach((col) => {
            if (col.value) {
                if (col.filter === "dateRange" && typeof col.value === "object") {
                    if (col.value.start) params.append(`${col.key}_start`, col.value.start);
                    if (col.value.end) params.append(`${col.key}_end`, col.value.end);
                } else {
                    params.append(col.key, String(col.value));
                }
            }
        });

        return params.toString();
    };

    useEffect(() => {
        const fetchData = async () => {
            const queryString = buildQueryParams();
            try {
                const response = await fetch(`${config.apiUrl}?${queryString}`);
                const data = await response.json();
                setRawData(data.results);
                setQueryCount(data.count);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [searchTerm, queryOffset, queryLimit, columns]);


    return (
        <div className="h-full flex flex-col items-center justify-between">
            <Filters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                columns={columns}
                setColumns={setColumns}
            />
            <DataTable columns={columns} data={rawData} />
            <Pagination
                queryOffset={queryOffset}
                queryCount={queryCount}
                queryLimit={queryLimit}
                setQueryOffset={setQueryOffset}
                setQueryLimit={setQueryLimit}
            />
        </div>
    );
};

export default Crudite;
