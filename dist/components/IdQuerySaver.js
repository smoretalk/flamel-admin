import React from 'react';
const DisplayImage = (props) => {
    console.log('href', location.href, props);
    if (!location.href.includes('actions/exportCsv')) {
        localStorage.setItem('query', new URLSearchParams(location.search).toString());
    }
    return (React.createElement("section", null,
        React.createElement("div", null, props.record.params.id)));
};
export default DisplayImage;
//# sourceMappingURL=IdQuerySaver.js.map