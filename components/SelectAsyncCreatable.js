import noop from 'lodash/noop.js';
import React, { lazy } from 'react';
import { cssClass } from '@adminjs/design-system';
import axios from "axios";
const ReactAsyncSelect = lazy(() => import('react-select/async-creatable'));
const SelectAsyncComponent = ReactAsyncSelect.default || ReactAsyncSelect;
export const SelectAsyncCreatable = (props) => {
    const { value, onChange, variant, ...selectProps } = props;
    const handleChange = (selected) => {
        if (typeof onChange === 'function')
            onChange(selected);
    };
    const onCreateOption = (option) => {
        console.log('onCreate', option);
        axios.post(`/api/collections/tags/CollectionKoTags/${option}`)
            .then(() => { });
    };
    return (React.createElement(SelectAsyncComponent, { className: cssClass('Select'), value: value, onChange: handleChange, isClearable: true, onCreateOption: onCreateOption, ...selectProps }));
};
SelectAsyncCreatable.defaultProps = {
    variant: 'default',
    onChange: noop,
};
export default SelectAsyncCreatable;
//# sourceMappingURL=SelectAsyncCreatable.js.map