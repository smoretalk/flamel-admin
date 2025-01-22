import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { format } from 'date-fns/format';
import axios from 'axios';
export const getExportedFileName = (extension) => `export-${format(Date.now(), 'yyyy-MM-dd_HH-mm')}.${extension}`;
const ExportCsv = ({ resource }) => {
    const [isFetching, setFetching] = useState();
    const filter = {};
    const query = new URLSearchParams(location.search || localStorage.getItem('query'));
    let page;
    for (const entry of query.entries()) {
        const [key, value] = entry;
        if (key.match('filters.')) {
            filter[key.replace('filters.', '')] = value;
        }
        if (key.match('page')) {
            page = parseInt(value, 10);
        }
    }
    const exportData = async () => {
        setFetching(true);
        try {
            const { data: { exportedData }, } = await axios
                .create({
                baseURL: '/admin',
            })
                .request({
                url: `/api/resources/${resource.id}/actions/exportCsv`,
                method: 'POST',
                params: {
                    filter,
                    page,
                },
            });
            const blob = new Blob([exportedData], { type: 'text/csv' });
            saveAs(blob, getExportedFileName('csv'));
        }
        catch (e) {
            console.error(e);
        }
        setFetching(false);
    };
    const onClose = () => {
        history.back();
    };
    return (React.createElement("div", null,
        React.createElement("button", { onClick: exportData, disabled: isFetching }, "CSV \uB2E4\uC6B4\uB85C\uB4DC"),
        React.createElement("button", { onClick: onClose }, "\uB2EB\uAE30")));
};
export default ExportCsv;
//# sourceMappingURL=ExportCsv.js.map