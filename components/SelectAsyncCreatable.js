import React, { lazy } from 'react';
import { cssClass } from '@adminjs/design-system';
const ReactAsyncSelect = lazy(() => import('react-select/async-creatable'));
const SelectAsyncComponent = ReactAsyncSelect.default || ReactAsyncSelect;
export const SelectAsyncCreatable = (props) => {
    const { value, onChange, variant, onCreateOption, ...selectProps } = props;
    const handleChange = (selected) => {
        if (typeof onChange === 'function')
            onChange(selected);
    };
    return (React.createElement(SelectAsyncComponent, { className: cssClass('Select'), value: value, onChange: handleChange, isClearable: true, onCreateOption: onCreateOption, ...selectProps }));
};
export default SelectAsyncCreatable;
//# sourceMappingURL=SelectAsyncCreatable.js.map