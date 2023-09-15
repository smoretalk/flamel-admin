import noop from 'lodash/noop.js'
import React, { FC, lazy } from 'react'
import { AsyncCreatableProps } from 'react-select/async-creatable'

import { cssClass } from '@adminjs/design-system';

const ReactAsyncSelect = lazy(() => import('react-select/async-creatable') as any) as any;

const SelectAsyncComponent: typeof import('react-select/async-creatable').default = ReactAsyncSelect.default || ReactAsyncSelect

interface SelectProps<Option = unknown, IsMulti extends boolean = false>
  extends AsyncCreatableProps<Option, IsMulti, any> {
  value: Option
  onChange?: (selected) => void
  variant?: 'default' | 'filter'
}

export const SelectAsyncCreatable: FC<SelectProps<unknown, boolean>> = (props) => {
  const { value, onChange, variant, ...selectProps } = props

  const handleChange = (selected) => {
    if (typeof onChange === 'function') onChange(selected)
  }

  const onCreateOption = (option: string) => {
    console.log('onCreate', option);
  };

  return (
    <SelectAsyncComponent
      className={cssClass('Select')}
      value={value}
      onChange={handleChange}
      isClearable
      onCreateOption={onCreateOption}
      {...selectProps}
    />
  )
}

SelectAsyncCreatable.defaultProps = {
  variant: 'default',
  onChange: noop,
}

export default SelectAsyncCreatable;