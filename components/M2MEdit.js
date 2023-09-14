import React, { useState, useEffect } from 'react';
import { FormGroup, FormMessage, Label, SelectAsync, } from '@adminjs/design-system';
import { ApiClient, useTranslation, } from 'adminjs';
import { unflatten } from 'flat';
const EditManyToManyInput = (props) => {
    const { onChange, property, record } = props;
    const { reference: resourceId } = property;
    const { translateProperty } = useTranslation();
    if (!resourceId) {
        throw new Error(`Cannot reference resource in property '${property.path}'`);
    }
    const handleChange = (selected) => {
        setSelectedOptions(selected);
        if (selected) {
            onChange(property.path, selected.map((option) => ({ id: option.value })));
        }
        else {
            onChange(property.path, null);
        }
    };
    const loadOptions = async (inputValue) => {
        const api = new ApiClient();
        const optionRecords = await api.searchRecords({
            resourceId,
            query: inputValue,
        });
        return optionRecords.map((optionRecord) => ({
            value: optionRecord.id,
            label: optionRecord.title,
        }));
    };
    const error = record?.errors[property.path];
    const selectedValues = unflatten(record.params)[property.path] || [];
    const selectedId = record?.params[property.path];
    const [loadedRecord, setLoadedRecord] = useState();
    const [loadingRecord, setLoadingRecord] = useState(0);
    const selectedValue = record?.populated[property.path] ?? loadedRecord;
    const selectedValuesToOptions = selectedValues.map((selectedValue) => ({
        value: selectedValue.id,
        label: selectedValue.title,
    }));
    const [selectedOptions, setSelectedOptions] = useState(selectedValuesToOptions);
    useEffect(() => {
        if (!selectedValue && selectedId) {
            setLoadingRecord((c) => c + 1);
            const api = new ApiClient();
            api
                .recordAction({
                actionName: 'show',
                resourceId,
                recordId: selectedId,
            })
                .then(({ data }) => {
                setLoadedRecord(data.record);
            })
                .finally(() => {
                setLoadingRecord((c) => c - 1);
            });
        }
    }, [selectedValue, selectedId, resourceId]);
    return (React.createElement(FormGroup, { error: Boolean(error) },
        React.createElement(Label, null, translateProperty(property.label)),
        React.createElement(SelectAsync, { isMulti: true, cacheOptions: true, value: selectedOptions, defaultOptions: true, loadOptions: loadOptions, onChange: handleChange, isClearable: true, isDisabled: property.isDisabled, isLoading: !!loadingRecord, ...property.props }),
        React.createElement(FormMessage, null, error?.message)));
};
export default EditManyToManyInput;
//# sourceMappingURL=M2MEdit.js.map