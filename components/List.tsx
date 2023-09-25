import { Box, Pagination, Text } from '@adminjs/design-system'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

export const REFRESH_KEY = 'refresh'
import { ActionProps, allowOverride, useRecords, useSelectedRecords, getActionElementCss, RecordsTable } from 'adminjs';

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

const OverridableList = allowOverride(List, 'DefaultListAction')

export default OverridableList;