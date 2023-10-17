import React from 'react';
const IdQuerySaver = (props) => {
    if (!location.href.includes('actions/exportCsv')) {
        localStorage.setItem('query', new URLSearchParams(location.search).toString());
        localStorage.setItem('model', location.pathname.split('/').at(-1));
    }
    return (React.createElement("section", null,
        React.createElement("div", null, props.record.params.userId || props.record.params.imageId)));
};
export default IdQuerySaver;
//# sourceMappingURL=IdQuerySaver.js.map