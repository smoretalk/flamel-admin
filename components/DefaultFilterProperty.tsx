import React, {ChangeEventHandler} from 'react'
import {FormGroup, Input, Select, CheckBox, Label} from '@adminjs/design-system'
import {FilterPropertyProps, PropertyLabel, useTranslation} from "adminjs";

const DefaultFilterProperty: React.FC<FilterPropertyProps> = (props) => {
  const { property, onChange, filter } = props
  const { tl } = useTranslation()

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(property.path, event.target.value)
  }

  const handleSelectChange = (selected?: { value: string }) => {
    const value = selected ? selected.value : ''
    onChange(property.path, value)
  }

  const toggleNullFilter: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.checked) {
      onChange(property.path, '!null')
    } else {
      onChange(property.path, '')
    }
  }

  const renderInput = () => {
    const filterKey = `filter-${property.path}`
    const value = filter[property.path] || ''
    if (property.availableValues) {
      const availableValues = property.availableValues.map((v) => ({
        ...v,
        label: tl(`${property.path}.${v.value}`, property.resourceId, { defaultValue: v.label ?? v.value }),
      }))

      const selected = availableValues.find((av) => av.value === value)

      return (
        <>
          <Select
            variant="filter"
            value={typeof selected === 'undefined' ? '' : selected}
            isClearable
            options={availableValues}
            onChange={handleSelectChange}
          />
          <Label inline>null 제외?
            <CheckBox onChange={toggleNullFilter} checked={value === '!null'} />
          </Label>
        </>
      )
    }
    return (
      <>
        <Input
          name={filterKey}
          onChange={handleInputChange}
          value={value}
        />
        <Label inline>null 제외?
          <CheckBox onChange={toggleNullFilter} checked={value === '!null'} />
        </Label>
      </>

    )
  }

  return (
    <FormGroup variant="filter">
      <PropertyLabel property={property} filter />
      {renderInput()}
    </FormGroup>
  )
}

export default DefaultFilterProperty;
