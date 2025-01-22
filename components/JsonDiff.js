import React from 'react';
import { FormGroup, Label } from '@adminjs/design-system';
import { flat, useTranslation } from "adminjs";
import RDV from "react-diff-viewer-continued/lib/src/index.js";
let ReactDiffViewer;
if (typeof RDV.default !== 'undefined') {
    ReactDiffViewer = RDV.default;
}
else {
    ReactDiffViewer = RDV;
}
const JsonDiff = (props) => {
    const { property, record } = props;
    const { translateProperty } = useTranslation();
    const difference = JSON.parse(record.params.difference);
    const before = {};
    const after = {};
    Object.entries(difference).forEach(([key, value]) => {
        if (value.before) {
            before[key] = value.before;
        }
        if (value.after) {
            after[key] = value.after;
        }
    });
    return (React.createElement(FormGroup, null,
        React.createElement(Label, null, translateProperty(property.label)),
        React.createElement(ReactDiffViewer, { oldValue: JSON.stringify(flat.unflatten(before), null, 2), newValue: JSON.stringify(flat.unflatten(after), null, 2) })));
};
export default React.memo(JsonDiff);
//# sourceMappingURL=JsonDiff.js.map