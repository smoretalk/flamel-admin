import { useTranslation } from 'adminjs';
import { Badge } from '@adminjs/design-system';
import React from 'react';
import startCase from 'lodash/startCase.js';
const DefaultPropertyValue = ({ property: { propertyPath, availableValues, path, props }, record, resource: { id: resourceId }, }) => {
    const rawValue = record?.params[path];
    const { translateProperty } = useTranslation();
    console.log(rawValue);
    if (typeof rawValue === 'undefined')
        return null;
    const option = availableValues?.find((opt) => opt.value == rawValue);
    if (option) {
        const label = option.label || rawValue;
        return (React.createElement(Badge, null, translateProperty(`${propertyPath}.${label}`, resourceId, {
            defaultValue: startCase(label),
        })));
    }
    console.log(rawValue.length, props.maxLen);
    return rawValue.slice(0, props.maxLen);
};
const LimitTextLength = (props) => (React.createElement(DefaultPropertyValue, { ...props }));
export default LimitTextLength;
//# sourceMappingURL=LimitTextLength.js.map