import { Box, Button, Drawer, DrawerContent, DrawerFooter, H3, Icon } from '@adminjs/design-system'
import isNil from 'lodash/isNil.js'
import pickBy from 'lodash/pickBy.js'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// @ts-ignore
import { useTranslation } from 'adminjs/lib/frontend/hooks/index.js'
// @ts-ignore
import { useFilterDrawer } from 'adminjs/lib/frontend/hooks/use-filter-drawer.js'
// @ts-ignore
import { useQueryParams } from 'adminjs/lib/frontend/hooks/use-query-params.js'
// @ts-ignore
import { RecordJSON, ResourceJSON } from 'adminjs/lib/frontend/interfaces/index.js'
// @ts-ignore
import { getResourceElementCss } from 'adminjs/lib/frontend/utils/index.js'
// @ts-ignore
import BasePropertyComponent from 'adminjs/lib/frontend/components/property-type/index.js'

export type FilterProps = {
  resource: ResourceJSON
}

type MatchProps = {
  resourceId: string
}

const FilterDrawer: React.FC<FilterProps> = (props) => {
  const { resource } = props
  const properties = resource.filterProperties;

  const [filter, setFilter] = useState<Record<string, unknown>>({})
  const params = useParams<MatchProps>()
  const { translateButton, translateLabel } = useTranslation()
  const initialLoad = useRef(true)
  const { isVisible, toggleFilter } = useFilterDrawer()
  const { storeParams, clearParams, filters } = useQueryParams()

  console.log('filterResource', resource);
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false
    } else {
      setFilter({})
    }
  }, [params.resourceId])

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    storeParams({ filters: pickBy(filter, (v) => !isNil(v)), page: '1' })
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
    setFilter({
      ...filter,
      [propertyName as string]: typeof value === 'string' && !value.length ? undefined : value,
    })
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
            <Icon icon="X" />
          </Button>
        </Box>
        <Box my="x3">
          {properties.map((property: { propertyPath: string }) => (
            <BasePropertyComponent
              key={property.propertyPath}
              where="filter"
              onChange={handleChange}
              property={property}
              filter={filter}
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

export { FilterDrawer };