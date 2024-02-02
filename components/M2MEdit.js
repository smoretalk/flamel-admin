import React, { useState, useEffect } from 'react';
import { FormGroup, FormMessage, Label, } from '@adminjs/design-system';
import { ApiClient, useTranslation, flat, } from 'adminjs';
import SelectAsyncCreatable from "./SelectAsyncCreatable.js";
import axios from "axios";
const EditManyToManyInput = (props) => {
    const [copyTarget, setCopyTarget] = useState('');
    const { onChange, property, record } = props;
    const { reference: resourceId } = property;
    const { translateProperty } = useTranslation();
    if (!resourceId) {
        throw new Error(`Cannot reference resource in property '${property.path}'`);
    }
    const onChangeCopyTarget = (e) => {
        setCopyTarget(e.target.value);
    };
    console.log(record, property);
    const handleChange = (selected) => {
        setSelectedOptions(selected);
        if (selected && Array.isArray(selected)) {
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
        console.log('resourceId', resourceId, 'inputValue', inputValue, 'optionRecords', optionRecords);
        return optionRecords.map((optionRecord) => ({
            value: optionRecord.id,
            label: optionRecord.title,
        }));
    };
    const error = record?.errors[property.path];
    const selectedValues = flat.get(flat.unflatten(record.params))[property.path] || [];
    const selectedId = record?.params[property.path];
    const [loadedRecord, setLoadedRecord] = useState();
    const [loadingRecord, setLoadingRecord] = useState(0);
    const selectedValue = record?.populated[property.path] ?? loadedRecord;
    const selectedValuesToOptions = selectedValues.map((selectedValue) => ({
        value: selectedValue.id || selectedValue.enTagId || selectedValue.koTagId,
        label: selectedValue.title,
    }));
    console.log('selectedValuesToOptions', selectedValuesToOptions);
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
    const isEnTag = (type, data) => {
        return type === 'CollectionEnTag';
    };
    const onCreateOption = (option) => {
        console.log('onCreate', option);
        axios.post(`/api/collections/tags/${property.reference}/${option}`)
            .then((response) => {
            console.log(`${option} 생성되었습니다.`, response);
            handleChange([...selectedOptions, {
                    value: isEnTag(property.reference, response.data) ? response.data.enTagId : response.data.koTagId,
                    label: response.data.title,
                }].filter(Boolean));
        });
    };
    const onCopyTag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const value = copyTarget;
        if (!value) {
            alert('아이디를 입력하세요.');
            return;
        }
        axios.get(`/api/admin/images/${value}`)
            .then((response) => {
            console.log(response);
            if (property.reference === 'CollectionEnTag') {
                handleChange(response.data.CollectionInfo.CollectionEnTags.map((v) => ({
                    value: v.enTagId,
                    label: v.title,
                })));
            }
            else if (property.reference === 'CollectionKoTag') {
                handleChange(response.data.CollectionInfo.CollectionKoTags.map((v) => ({
                    value: v.koTagId,
                    label: v.title,
                })));
            }
        });
    };
    return (React.createElement(FormGroup, { error: Boolean(error) },
        React.createElement(Label, null, translateProperty(property.label)),
        React.createElement(SelectAsyncCreatable, { isMulti: true, cacheOptions: true, value: selectedOptions, defaultOptions: true, loadOptions: loadOptions, onChange: handleChange, isClearable: true, isDisabled: property.isDisabled, isLoading: !!loadingRecord, onCreateOption: onCreateOption, ...property.props }),
        React.createElement(FormMessage, null, error?.message),
        React.createElement("div", null,
            React.createElement("input", { id: "copyTarget", value: copyTarget, onChange: onChangeCopyTarget, placeholder: "\uD0DC\uADF8\uB97C \uBCF5\uC0AC\uD560 \uC774\uBBF8\uC9C0 \uC544\uC774\uB514\uB97C \uB123\uC73C\uC138\uC694." }),
            React.createElement("button", { onClick: onCopyTag }, "\uBCF5\uC0AC"))));
};
export default EditManyToManyInput;
//# sourceMappingURL=M2MEdit.js.map