import React, { FC, useState, useEffect } from 'react';
import {
  FormGroup,
  FormMessage,
  Label,
} from '@adminjs/design-system';
import {
  ApiClient,
  EditPropertyPropsInArray,
  RecordJSON,
  SelectRecord, useTranslation,
} from 'adminjs';
import { unflatten } from 'flat';
import SelectAsyncCreatable from "./SelectAsyncCreatable.js";
import axios from "axios";

type CombinedProps = EditPropertyPropsInArray;
type SelectRecordEnhanced = SelectRecord & {
  // record: RecordJSON;
};

const EditManyToManyInput: FC<CombinedProps> = (props) => {
  const { onChange, property, record } = props;
  const { reference: resourceId } = property;
  const { translateProperty } = useTranslation();

  if (!resourceId) {
    throw new Error(`Cannot reference resource in property '${property.path}'`);
  }

  console.log(record, property);

  const handleChange = (selected: { label: string, value: number }[]): void => {
    setSelectedOptions(selected);
    if (selected && Array.isArray(selected)) {
      onChange(
        property.path,
        selected.map((option) => ({ id: option.value })),
      );
    } else {
      onChange(property.path, null);
    }
  };

  const loadOptions = async (
    inputValue: string,
  ): Promise<SelectRecordEnhanced[]> => {
    const api = new ApiClient();

    const optionRecords = await api.searchRecords({
      resourceId,
      query: inputValue,
    });
    console.log('resourceId', resourceId, 'inputValue', inputValue, 'optionRecords', optionRecords);

    return optionRecords.map((optionRecord: RecordJSON) => ({
      value: optionRecord.id,
      label: optionRecord.title,
    }));
  };
  const error = record?.errors[property.path];

  let selectedValues: Array<{ id: number, enTagId: number, koTagId: number, title: string }> = [];
  if (property.path.includes('.')) {
    // 중첩된 경로면
    const middle = property.path.split('.')[0];
    const last = property.path.split('.')[1];
    selectedValues = (unflatten(record.params) as Record<string, Record<string, typeof selectedValues>>)[middle]?.[last] || [];
  } else {
    selectedValues = (unflatten(record.params) as Record<string, typeof selectedValues>)[property.path] || [];
  }

  const selectedId = record?.params[property.path] as string | undefined;
  const [loadedRecord, setLoadedRecord] = useState<RecordJSON | undefined>();
  const [loadingRecord, setLoadingRecord] = useState(0);
  const selectedValue = record?.populated[property.path] ?? loadedRecord;
  const selectedValuesToOptions: Array<{value: number, label: string }> = selectedValues.map((selectedValue) => ({
    value: selectedValue.id || selectedValue.enTagId || selectedValue.koTagId,
    label: selectedValue.title,
  }));
  console.log('selectedValuesToOptions', selectedValuesToOptions);
  const [selectedOptions, setSelectedOptions] = useState(
    selectedValuesToOptions,
  );

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
        .then(({ data }: any) => {
          setLoadedRecord(data.record);
        })
        .finally(() => {
          setLoadingRecord((c) => c - 1);
        });
    }
  }, [selectedValue, selectedId, resourceId]);

  const onCreateOption = (option: string) => {
    console.log('onCreate', option);
    axios.post<{ enTagId: number, koTagId: number, title: string }>(`/api/collections/tags/${property.reference}/${option}`)
      .then((response) => {
        console.log(`${option} 생성되었습니다.`, response);
        setSelectedOptions((prev) => {
          handleChange([...prev, {
            value: response.data.enTagId || response.data.koTagId,
            label: response.data.title,
          }].filter(Boolean));
          return [...prev, {
            value: response.data.enTagId || response.data.koTagId,
            label: response.data.title,
          }]
        });
      });
  };

  return (
    <FormGroup error={Boolean(error)}>
      <Label>{translateProperty(property.label)}</Label>
      <SelectAsyncCreatable
        isMulti={true}
        cacheOptions
        value={selectedOptions}
        defaultOptions
        loadOptions={loadOptions}
        onChange={handleChange as (v: unknown) => void}
        isClearable
        isDisabled={property.isDisabled}
        isLoading={!!loadingRecord}
        onCreateOption={onCreateOption}
        {...property.props}
      />
      <FormMessage>{error?.message}</FormMessage>
    </FormGroup>
  );
};

export default EditManyToManyInput;
