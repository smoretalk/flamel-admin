import {Box, Button, Drawer, DrawerContent, DrawerFooter, H3, Icon} from '@adminjs/design-system'
import isNil from 'lodash/isNil.js'
import pickBy from 'lodash/pickBy.js'
import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

import {
  useTranslation,
  RecordJSON,
  ResourceJSON,
  BasePropertyComponent,
  useQueryParams,
  useFilterDrawer,
  BasePropertyJSON,
} from 'adminjs'
import flat from "flat";

export const getDataCss = (...args: string[]) => args.join('-');
export const getResourceElementCss = (resourceId: string, suffix: string) => getDataCss(resourceId, suffix);

export type FilterProps = {
  resource: ResourceJSON
}

type MatchProps = {
  resourceId: string
}

const FilterDrawer: React.FC<FilterProps> = (props) => {
  const {resource} = props
  const properties = resource.filterProperties;

  const [filter, setFilter] = useState<Record<string, any>>({})
  console.log('filter', filter);
  const params = useParams<MatchProps>()
  const {translateButton, translateLabel} = useTranslation()
  const initialLoad = useRef(true)
  const {isVisible, toggleFilter} = useFilterDrawer()
  const {storeParams, clearParams, filters} = useQueryParams()

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false
    } else {
      setFilter({})
    }
  }, [params.resourceId])

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    storeParams({filters: pickBy(filter, (v) => !isNil(v)), page: '1'})
  }

  const handleReset = (event: SubmitEvent) => {
    event.preventDefault()
    clearParams('filters')
    setFilter({})
  }

  useEffect(() => {
    if (filters) {
      setFilter(filters)
    }
  }, [filters])

  const handleChange = (propertyName: string | RecordJSON, value: any): void => {
    if ((propertyName as RecordJSON).params) {
      throw new Error('you can not pass RecordJSON to filters')
    }
    console.log('propertyName', propertyName, value);
    const newData = flat.unflatten({
      ...filter,
      [propertyName as string]: typeof value === 'string' && !value.length ? undefined : value,
    }, { overwrite: true });
    console.log('newData', newData);
    setFilter(newData);
  }

  const contentTag = getResourceElementCss(resource.id, 'filter-drawer')
  const cssContent = getResourceElementCss(resource.id, 'filter-drawer-content')
  const cssFooter = getResourceElementCss(resource.id, 'filter-drawer-footer')
  const cssButtonApply = getResourceElementCss(resource.id, 'filter-drawer-button-apply')
  const cssButtonReset = getResourceElementCss(resource.id, 'filter-drawer-button-reset')

  return (
    <Drawer
      variant="filter"
      isHidden={!isVisible}
      as="form"
      onSubmit={handleSubmit}
      onReset={handleReset}
      data-css={contentTag}
    >
      <DrawerContent data-css={cssContent}>
        <Box flex justifyContent="space-between">
          <H3>{translateLabel('filters', resource.id)}</H3>
          <Button
            type="button"
            variant="light"
            size="icon"
            rounded
            color="text"
            onClick={toggleFilter}
          >
            <Icon icon="X"/>
          </Button>
        </Box>
        <Box my="x3">
          {properties.map((property: BasePropertyJSON) => (
            <BasePropertyComponent
              key={property.propertyPath}
              where="filter"
              onChange={handleChange}
              property={property}
              filter={flat.flatten(filter)}
              resource={resource}
            />
          ))}
        </Box>
      </DrawerContent>
      <DrawerFooter data-css={cssFooter}>
        <Button type="button" variant="light" onClick={handleReset} data-css={cssButtonReset}>
          {translateButton('resetFilter', resource.id)}
        </Button>
        <Button type="submit" variant="contained" data-css={cssButtonApply}>
          {translateButton('applyChanges', resource.id)}
        </Button>
      </DrawerFooter>
    </Drawer>
  )
}

export default FilterDrawer;
