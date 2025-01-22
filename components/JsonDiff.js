import React from 'react';
import { FormGroup, Label } from '@adminjs/design-system';
import { flat, useTranslation } from "adminjs";
import Viewer from "react-json-view-compare";
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
        React.createElement(Viewer, { oldData: flat.unflatten(before), newData: flat.unflatten(after) })));
};
export default React.memo(JsonDiff);
//# sourceMappingURL=JsonDiff.js.map