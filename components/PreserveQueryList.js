import { Box, Pagination, Text } from '@adminjs/design-system';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
export const REFRESH_KEY = 'refresh';
import { useRecords, useSelectedRecords, RecordsTable, useQueryParams } from 'adminjs';
export const getActionElementCss = (resourceId, actionName, suffix) => `${resourceId}-${actionName}-${suffix}`;
const PreserveQueryList = ({ resource, setTag }) => {
    const { records, loading, direction, sortBy, page, total, fetchData, perPage, } = useRecords(resource.id);
    const { selectedRecords, handleSelect, handleSelectAll, setSelectedRecords, } = useSelectedRecords(records);
    const location = useLocation();
    const navigate = useNavigate();
    const { storeParams } = useQueryParams();
    useEffect(() => {
        if (setTag) {
            setTag(total.toString());
        }
    }, [total]);
    useEffect(() => {
        let modelName = location.pathname.split('/').at(-1);
        const query = localStorage.getItem(`query-${modelName}`);
        if (query && !location.search) {
            console.log(`query ${query} found, navigating...`);
            navigate(`${location.pathname}?${query}`, {
                replace: true,
            });
        }
    }, [location]);
    useEffect(() => {
        setSelectedRecords([]);
    }, [resource.id]);
    useEffect(() => {
        const search = new URLSearchParams(location.search);
        if (search.get(REFRESH_KEY)) {
            setSelectedRecords([]);
        }
        else {
            const recordIds = search.get('recordIds')?.split?.(',') ?? [];
            setSelectedRecords(records.filter((r) => recordIds.includes(r.id.toString())));
        }
    }, [location.search, records]);
    const handleActionPerformed = () => {
        console.log('action performed');
        return fetchData();
    };
    const handlePaginationChange = (pageNumber) => {
        storeParams({ page: pageNumber.toString() });
    };
    const contentTag = getActionElementCss(resource.id, 'list', 'table-wrapper');
    return (React.createElement(Box, { variant: "container", "data-css": contentTag },
        React.createElement(RecordsTable, { resource: resource, records: records, actionPerformed: handleActionPerformed, onSelect: handleSelect, onSelectAll: handleSelectAll, selectedRecords: selectedRecords, direction: direction, sortBy: sortBy, isLoading: loading }),
        React.createElement(Text, { mt: "xl", textAlign: "center" },
            React.createElement(Pagination, { page: page, perPage: perPage, total: total, onChange: handlePaginationChange }))));
};
export default PreserveQueryList;
//# sourceMappingURL=PreserveQueryList.js.map