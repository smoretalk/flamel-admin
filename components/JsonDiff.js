import React from 'react';
import { FormGroup, Label } from '@adminjs/design-system';
import { flat, useTranslation } from "adminjs";
import { default as DiffViewer } from "react-diff-viewer-continued";
const JsonDiff = (props) => {
    const { property, record } = props;
    const { translateProperty } = useTranslation();
    const difference = JSON.parse(record.params.difference);
    const before = {};
    const after = {};
    Object.entries(difference).forEach(([key, value]) => {
        if (difference[key].before) {
            before[key] = value;
        }
        if (difference[key].after) {
            after[key] = value;
        }
    });
    return (React.createElement(FormGroup, null,
        React.createElement(Label, null, translateProperty(property.label)),
        React.createElement(DiffViewer, { oldValue: JSON.stringify(flat.unflatten(before)), newValue: JSON.stringify(flat.unflatten(after)) })));
};
export default React.memo(JsonDiff);
//# sourceMappingURL=JsonDiff.js.map