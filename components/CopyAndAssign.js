import React, { useEffect, useMemo, useState } from "react";
import { flat, ApiClient } from "adminjs";
import { Button, FormGroup, FormMessage, SelectAsync } from "@adminjs/design-system";
import { PropertyLabel } from "adminjs";
import axios from "axios";
export default function CopyAndAssign(props) {
    const { property, record } = props;
    const { reference: resourceId } = property;
    const [id, setId] = useState();
    if (!resourceId) {
        throw new Error(`Cannot reference resource in property '${property.path}'`);
    }
    const handleChange = (selected) => {
        console.log(property.path, selected.value, selected.record);
        setId(selected.value);
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
            record: optionRecord,
        }));
    };
    const error = record?.errors[property.path];
    const selectedId = useMemo(() => flat.get(record?.params, property.path), [record]);
    const [loadedRecord, setLoadedRecord] = useState();
    const [loadingRecord, setLoadingRecord] = useState(0);
    const onCopy = () => {
        if (!id) {
            return alert('유저를 선택하세요.');
        }
        axios.post(`/api/categories/${record.id}/copy/${id}`)
            .then(() => {
            console.log('복사되었습니다.');
        })
            .catch(console.error);
    };
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
        React.createElement(Button, { onClick: onCopy }, "\uC774 \uC0AC\uB78C\uC5D0\uAC8C \uC2A4\uD0C0\uC77C \uBCF5\uC0AC"),
        React.createElement(FormMessage, null, error?.message)));
}
//# sourceMappingURL=CopyAndAssign.js.map