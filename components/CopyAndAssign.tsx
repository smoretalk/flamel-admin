import {RecordJSON} from "adminjs";
import React, {useEffect, useMemo, useState} from "react";
import {flat, ApiClient} from "adminjs";
import {Button, FormGroup, FormMessage, SelectAsync} from "@adminjs/design-system";
import {EditPropertyProps, PropertyLabel} from "adminjs";
import {SelectRecord} from "adminjs";
import axios from "axios";
type SelectRecordEnhanced = SelectRecord & {
  record: RecordJSON;
}

export default function CopyAndAssign(props: EditPropertyProps) {
  const { property, record } = props
  const { reference: resourceId } = property;
  const [id, setId] = useState<number>();

  if (!resourceId) {
    throw new Error(`Cannot reference resource in property '${property.path}'`)
  }

  const handleChange = (selected: SelectRecordEnhanced): void => {
    console.log(property.path, selected.value, selected.record);
    setId(selected.value as number);
  }

  const loadOptions = async (inputValue: string): Promise<SelectRecordEnhanced[]> => {
    const api = new ApiClient()

    const optionRecords = await api.searchRecords({
      resourceId,
      query: inputValue,
    })
    return optionRecords.map((optionRecord: RecordJSON) => ({
      value: optionRecord.id,
      label: optionRecord.title,
      record: optionRecord,
    }))
  }
  const error = record?.errors[property.path]

  const selectedId = useMemo(
    () => flat.get(record?.params, property.path) as string | undefined,
    [record],
  )
  const [loadedRecord, setLoadedRecord] = useState<RecordJSON | undefined>()
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
  }

  useEffect(() => {
    if (selectedId) {
      setLoadingRecord((c) => c + 1)
      const api = new ApiClient()
      api.recordAction({
        actionName: 'show',
        resourceId,
        recordId: selectedId,
      }).then(({ data }: any) => {
        setLoadedRecord(data.record)
      }).finally(() => {
        setLoadingRecord((c) => c - 1)
      })
    }
  }, [selectedId, resourceId])

  const selectedValue = loadedRecord
  const selectedOption = (selectedId && selectedValue) ? {
    value: selectedValue.id,
    label: selectedValue.title,
  } : {
    value: '',
    label: '',
  }

  return (
    <FormGroup error={Boolean(error)}>
      <PropertyLabel property={property} />
      <SelectAsync
        cacheOptions
        value={selectedOption}
        defaultOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        isClearable
        isDisabled={property.isDisabled}
        isLoading={!!loadingRecord}
        {...property.props}
      />
      <Button onClick={onCopy}>이 사람에게 스타일 복사</Button>
      <FormMessage>{error?.message}</FormMessage>
    </FormGroup>
  )
}
