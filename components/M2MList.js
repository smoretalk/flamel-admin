import { flat, } from 'adminjs';
import React from 'react';
import ReferenceValue from './ReferenceValue.js';
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";
export default class ManyToManyList extends React.PureComponent {
    render() {
        const { property, record, ItemComponent } = this.props;
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
        return (React.createElement(ThemeProvider, { theme: theme }, (items || []).map((item, i) => {
            return (React.createElement(ReferenceValue, { key: i, ...this.props, record: item, property: property }));
        })));
    }
}
//# sourceMappingURL=M2MList.js.map