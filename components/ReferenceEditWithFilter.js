import React, { useState, useEffect, useMemo } from 'react';
import { FormGroup, FormMessage, SelectAsync } from '@adminjs/design-system';
import { ApiClient, flat, PropertyLabel } from 'adminjs';
const ReferenceEditWithFilter = (props) => {
    const { onChange, property, record } = props;
    const { reference: resourceId, props: customProps } = property;
    if (!resourceId) {
        throw new Error(`Cannot reference resource in property '${property.path}'`);
    }
    const handleChange = (selected) => {
        if (selected) {
            onChange(property.path, selected.value, selected.record);
        }
        else {
            onChange(property.path, null);
        }
    };
    const loadOptions = async (inputValue) => {
        const api = new ApiClient();
        const response = await api.resourceAction({
            resourceId,
            actionName: 'search',
            query: inputValue,
            params: customProps,
        });
        return response.data.records.map((optionRecord) => ({
            value: optionRecord.id,
            label: optionRecord.title,
            record: optionRecord,
        }));
    };
    const error = record?.errors[property.path];
    const selectedId = useMemo(() => flat.get(record?.params, property.path), [record]);
    const [loadedRecord, setLoadedRecord] = useState();
    const [loadingRecord, setLoadingRecord] = useState(0);
    useEffect(() => {
        if (selectedId) {
            setLoadingRecord((c) => c + 1);
            const api = new ApiClient();
            api.recordAction({
                actionName: 'show',
                resourceId,
                recordId: selectedId,
            }).then(({ data }) => {
                setLoadedRecord(data.record);
            }).finally(() => {
                setLoadingRecord((c) => c - 1);
            });
        }
    }, [selectedId, resourceId]);
    const selectedValue = loadedRecord;
    const selectedOption = (selectedId && selectedValue) ? {
        value: selectedValue.id,
        label: selectedValue.title,
    } : {
        value: '',
        label: '',
    };
    return (React.createElement(FormGroup, { error: Boolean(error) },
        React.createElement(PropertyLabel, { property: property }),
        React.createElement(SelectAsync, { cacheOptions: true, value: selectedOption, defaultOptions: true, loadOptions: loadOptions, onChange: handleChange, isClearable: true, isDisabled: property.isDisabled, isLoading: !!loadingRecord, ...property.props }),
        React.createElement(FormMessage, null, error?.message)));
};
export default ReferenceEditWithFilter;
//# sourceMappingURL=ReferenceEditWithFilter.js.map