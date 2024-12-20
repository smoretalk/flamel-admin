import React, {FC, useState, useEffect, MouseEventHandler, ChangeEventHandler} from 'react';
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
  flat,
} from 'adminjs';
import SelectAsyncCreatable from "./SelectAsyncCreatable.js";
import axios from "axios";

type CombinedProps = EditPropertyPropsInArray;
type SelectRecordEnhanced = SelectRecord & {
  // record: RecordJSON;
};

type EnTag = {
  enTagId: number,
  title: string
};
type KoTag = {
  koTagId: number,
  title: string
};
type Theme = {
  themeId: number,
  code: string;
}
const EditManyToManyInput: FC<CombinedProps> = (props) => {
  const [copyTarget, setCopyTarget] = useState('');
  const {onChange, property, record} = props;
  const {reference: resourceId} = property;
  const {translateProperty} = useTranslation();

  if (!resourceId) {
    throw new Error(`Cannot reference resource in property '${property.path}'`);
  }

  const onChangeCopyTarget: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCopyTarget(e.target.value);
  }

  console.log(record, property);

  const handleChange = (selected: { label: string, value: number }[]): void => {
    setSelectedOptions(selected);
    if (selected && Array.isArray(selected)) {
      onChange(
        property.path,
        selected.map((option) => ({id: option.value})),
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

  const selectedValues: Array<EnTag | KoTag | Theme> = flat.get(record.params as Record<string, Record<string, typeof selectedValues>>, property.path) || [];
  const selectedId = record?.params[property.path] as string | undefined;
  const [loadedRecord, setLoadedRecord] = useState<RecordJSON | undefined>();
  const [loadingRecord, setLoadingRecord] = useState(0);
  const selectedValue = record?.populated[property.path] ?? loadedRecord;
  const isTagType = property.reference === 'CollectionEnTag' || property.reference === 'CollectionKoTag';
  console.log('selectedValues', selectedValues, selectedValue, property.props);
  const selectedValuesToOptions: Array<{ value: number, label: string }> = selectedValues.map((selectedValue) => ({
    value: flat.get(selectedValue, property.props.pk),
    label: (flat.flatten(selectedValue) as Record<string, string>)[property.props.title],
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
        .then(({data}: any) => {
          setLoadedRecord(data.record);
        })
        .finally(() => {
          setLoadingRecord((c) => c - 1);
        });
    }
  }, [selectedValue, selectedId, resourceId]);

  const onCreateOption = (option: string) => {
    console.log('onCreate', option, property.props);
    axios.post<EnTag | KoTag>(`/api/collections/tags/${property.reference}/${option}`)
      .then((response) => {
        console.log(`${option} 생성되었습니다.`, response);
        handleChange([...selectedOptions, {
          value: flat.get(response.data, property.props.pk),
          label: (flat.flatten(response.data) as Record<string, string>)[property.props.title],
        }].filter(Boolean));
      });
  };

  const onCopyTag: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const value = copyTarget;
    if (!value) {
      alert('아이디를 입력하세요.');
      return;
    }
    axios.get<{
      CollectionInfo: {
        CollectionEnTags: EnTag[],
        CollectionKoTags: KoTag[]
      }
    }>(`/api/admin/images/${value}`)
      .then((response) => {
        console.log(response);
        if (property.reference === 'CollectionEnTag') {
          handleChange(response.data.CollectionInfo.CollectionEnTags.map((v) => ({
            value: v.enTagId,
            label: v.title,
          })))
        } else if (property.reference === 'CollectionKoTag') {
          handleChange(response.data.CollectionInfo.CollectionKoTags.map((v) => ({
            value: v.koTagId,
            label: v.title,
          })))
        }
      });
  }

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
        onCreateOption={isTagType ? onCreateOption : () => {}}
        {...property.props}
      />
      <FormMessage>{error?.message}</FormMessage>
      {isTagType && (
        <div>
          <input id="copyTarget" value={copyTarget} onChange={onChangeCopyTarget} placeholder="태그를 복사할 이미지 아이디를 넣으세요."/>
          <button onClick={onCopyTag}>복사</button>
        </div>
      )}
    </FormGroup>
  );
};

export default EditManyToManyInput;
