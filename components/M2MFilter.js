import React from 'react';
import { FormGroup, Input, Select, CheckBox, Label } from '@adminjs/design-system';
import { PropertyLabel, useTranslation } from "adminjs";
const M2MFilter = (props) => {
    const { property, onChange, filter } = props;
    const { tl } = useTranslation();
    const handleInputChange = (event) => {
        onChange(property.path, event.target.value);
    };
    const handleSelectChange = (selected) => {
        const value = selected ? selected.value : '';
        onChange(property.path, value);
    };
    const toggleNullFilter = (event) => {
        if (event.target.checked) {
            onChange(property.path, '!null');
        }
        else {
            onChange(property.path, '');
        }
    };
    const renderInput = () => {
        const filterKey = `filter-${property.path}`;
        const value = filter[property.path] || '';
        if (property.availableValues) {
            const availableValues = property.availableValues.map((v) => ({
                ...v,
                label: tl(`${property.path}.${v.value}`, property.resourceId, { defaultValue: v.label ?? v.value }),
            }));
            const selected = availableValues.find((av) => av.value === value);
            return (React.createElement(React.Fragment, null,
                React.createElement(Select, { variant: "filter", value: typeof selected === 'undefined' ? '' : selected, isClearable: true, options: availableValues, onChange: handleSelectChange }),
                React.createElement(Label, { inline: true },
                    "null \uC81C\uC678?",
                    React.createElement(CheckBox, { onChange: toggleNullFilter, checked: value === '!null' }))));
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(Input, { name: filterKey, onChange: handleInputChange, value: value }),
            React.createElement(Label, { inline: true },
                "null \uC81C\uC678?",
                React.createElement(CheckBox, { onChange: toggleNullFilter, checked: value === '!null' }))));
    };
    return (React.createElement(FormGroup, { variant: "filter" },
        React.createElement(PropertyLabel, { property: property, filter: true }),
        renderInput()));
};
export default M2MFilter;
//# sourceMappingURL=M2MFilter.js.map