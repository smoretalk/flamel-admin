import * as React from 'react';
import { Box, Label } from '@adminjs/design-system';
import ReactJson from '@microlink/react-json-view';
import * as _ from 'lodash';
import { flat, useTranslation } from "adminjs";
const EditJSONB = (props) => {
    const { property, record, onChange } = props;
    const { translateProperty } = useTranslation();
    const matchingParams = _.chain(record.params)
        .pickBy((value, key) => key.startsWith(property.name))
        .value();
    const paramObject = flat.get(matchingParams, property.name);
    const saveData = (data) => {
        onChange(property.name, data);
    };
    const onEdit = (event) => {
        const updated_src = event?.updated_src;
        saveData(updated_src);
    };
    const onAdd = (event) => {
        const updated_src = event?.updated_src;
        saveData(updated_src);
    };
    const onDelete = (event) => {
        const updated_src = event?.updated_src;
        saveData(updated_src);
    };
    return (React.createElement(Box, { mb: "xl" },
        React.createElement(Label, null, translateProperty(property.label)),
        React.createElement(ReactJson, { name: property.name, collapsed: false, src: paramObject || {}, onEdit: onEdit, onAdd: onAdd, onDelete: onDelete })));
};
export default EditJSONB;
//# sourceMappingURL=EditJSONB.js.map