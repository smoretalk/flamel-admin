import * as React from 'react';
import { Box, Label } from '@adminjs/design-system';
import ReactJson from 'react-json-view';
import * as _ from 'lodash';
import { unflatten } from 'flat';
const EditJSONB = (props) => {
    const { property, record, onChange } = props;
    const matchingParams = _.chain(record.params)
        .omitBy(_.isNil)
        .pickBy((value, key) => key.startsWith(property.name))
        .value();
    const object = unflatten(matchingParams);
    const paramObject = object?.[property.name];
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
        React.createElement(Label, null, property.label),
        React.createElement(ReactJson, { name: property.name, collapsed: false, src: paramObject, onEdit: onEdit, onAdd: onAdd, onDelete: onDelete })));
};
export default EditJSONB;
//# sourceMappingURL=EditJSONB.js.map