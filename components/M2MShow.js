import { ValueGroup } from '@adminjs/design-system';
import { flat, useTranslation, } from 'adminjs';
import React from 'react';
import ReferenceValue from './ReferenceValue.js';
export default function ManyToManyShow(props) {
    const { translateProperty } = useTranslation();
    const { property, record, ItemComponent } = props;
    const DELIMITER = '.';
    const getSubpropertyPath = (path, index) => [path, index].join(DELIMITER);
    const convertToSubProperty = (arrayProperty, index) => ({
        ...arrayProperty,
        path: getSubpropertyPath(arrayProperty.path, index),
        label: `[${index + 1}]`,
        isArray: false,
        isDraggable: false,
    });
    const items = flat.get(record.params, property.path) || [];
    return (React.createElement(React.Fragment, null,
        React.createElement(ValueGroup, { label: translateProperty(property.label) }, (items || []).map((item, i) => {
            return (React.createElement(ReferenceValue, { key: i, ...props, record: item, property: property }));
        }))));
}
//# sourceMappingURL=M2MShow.js.map