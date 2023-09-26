import { Box, Pagination, Text } from '@adminjs/design-system'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

export const REFRESH_KEY = 'refresh'
import { ActionProps, useRecords, useSelectedRecords, RecordsTable } from 'adminjs';
export const getActionElementCss = (resourceId: string, actionName: string, suffix: string) => `${resourceId}-${actionName}-${suffix}`

const List: React.FC<ActionProps> = ({ resource, setTag }) => {
  const {
    records,
    loading,
    direction,
    sortBy,
    page,
    total,
    fetchData,
    perPage,
  } = useRecords(resource.id)
  console.log('records', records)
  const {
    selectedRecords,
    handleSelect,
    handleSelectAll,
    setSelectedRecords,
  } = useSelectedRecords(records)
  console.log('selectedRecords', selectedRecords);
  const location = useLocation()
  const navigate = useNavigate()
  const [newResource, setNewResource] = useState(resource);

  function resourceFinder(list) {
    const resourceList = [];
    list.forEach((item) => {
      resourceList.push(resource.properties[item]);
    })
    return resourceList;
  }
  useEffect(() => {
    if (records.length) {
      setTimeout(() => {
        console.log('location.href', window.location.href);
        const isCollection = new URLSearchParams(window.location.search).get('filters.Owner') === '0';
        console.log('isCollection', isCollection);

        if (isCollection) {
          setNewResource({
            ...resource,
            listProperties: resourceFinder(['idQuerySaver', 'displayImage', 'CollectionInfo.Style', 'CollectionInfo.priority', 'CollectionInfo.promptKo', 'CollectionInfo.promptEn', 'CollectionInfo.Theme', 'CollectionInfo.enabled']),
          })
        }
      }, 1000)
    }
  }, [records, location]);

  useEffect(() => {
    console.log('newResource changed', newResource);
  }, [newResource]);

  useEffect(() => {
    if (setTag) {
      setTag(total.toString())
    }
  }, [total])

  useEffect(() => {
    setSelectedRecords([])
  }, [resource.id])

  useEffect(() => {
    const search = new URLSearchParams(location.search)
    if (search.get(REFRESH_KEY)) {
      setSelectedRecords([])
    }
  }, [location.search])

  const handleActionPerformed = (): any => fetchData()

  const handlePaginationChange = (pageNumber: number): void => {
    const search = new URLSearchParams(location.search)
    search.set('page', pageNumber.toString())
    navigate({ search: search.toString() })
  }

  const contentTag = getActionElementCss(resource.id, 'list', 'table-wrapper')

  return (
    <Box variant="container" data-css={contentTag}>
      <RecordsTable
        resource={resource}
        records={records}
        actionPerformed={handleActionPerformed}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        selectedRecords={selectedRecords}
        direction={direction}
        sortBy={sortBy}
        isLoading={loading}
      />
      <Text mt="xl" textAlign="center">
        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          onChange={handlePaginationChange}
        />
      </Text>
    </Box>
  )
}

export default List;
