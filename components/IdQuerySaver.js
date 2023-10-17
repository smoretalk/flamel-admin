import React from 'react';
const IdQuerySaver = (props) => {
    if (!location.href.includes('actions/exportCsv')) {
        const model = location.pathname.split('/').at(-1);
        localStorage.setItem(`query-${model}`, new URLSearchParams(location.search).toString());
    }
    return (React.createElement("section", null,
        React.createElement("div", null, props.record.params.userId || props.record.params.imageId)));
};
export default IdQuerySaver;
//# sourceMappingURL=IdQuerySaver.js.map