import {Box, Pagination, Text} from '@adminjs/design-system'
import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router'

export const REFRESH_KEY = 'refresh'
import {ActionProps, useRecords, useSelectedRecords, RecordsTable, BasePropertyJSON, useQueryParams} from 'adminjs';

export const getActionElementCss = (resourceId: string, actionName: string, suffix: string) => `${resourceId}-${actionName}-${suffix}`

const List: React.FC<ActionProps> = ({resource, setTag}) => {
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
  const {
    selectedRecords,
    handleSelect,
    handleSelectAll,
    setSelectedRecords,
  } = useSelectedRecords(records)
  const location = useLocation()
  const navigate = useNavigate()
  const [newResource, setNewResource] = useState(resource);
  const {storeParams} = useQueryParams()

  function resourceFinder(list: string[]) {
    const resourceList: BasePropertyJSON[] = [];
    list.forEach((item) => {
      resourceList.push(resource.properties[item]);
    })
    return resourceList;
  }

  useEffect(() => {
    if (records.length) {
      setTimeout(() => {
        console.log('location.href', window.location.href);
        const isCollection = new URLSearchParams(window.location.search).get('filters.CollectionInfo.enabled');
        console.log('isCollection', isCollection);

        if (isCollection && isCollection !== 'false') {
          setNewResource({
            ...resource,
            listProperties: resourceFinder(['idQuerySaver', 'displayImage', 'CollectionInfo.Style', 'CollectionInfo.priority', 'CollectionInfo.prompt', 'CollectionInfo.Theme', 'CollectionInfo.enabled', 'CollectionInfo.is2x', 'CollectionInfo.rank']),
          })
        } else {
          setNewResource({
            ...resource,
            listProperties: resourceFinder([
              'idQuerySaver',
              'displayImage',
              'createdAt',
              'Owner',
              'model',
              'GenerationInfo.super',
              'GenerationInfo.main',
              'GenerationInfo.sub',
              'resolution',
              'GenerationInfo.originalPrompt',
              'GenerationInfo.translatedPrompt',
              'GenerationInfo.preset',
            ]),
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
    let modelName = location.pathname.split('/').at(-1);
    const query = localStorage.getItem(
      `query-${modelName}`,
    );
    if (query && !location.search) {
      console.log(`query ${query} found, navigating...`);
      navigate(`${location.pathname}?${query}`, {
        replace: true,
      });
    }

  }, [location]);

  useEffect(() => {
    setSelectedRecords([])
  }, [resource.id])

  useEffect(() => {
    const search = new URLSearchParams(location.search)
    if (search.get(REFRESH_KEY)) {
      setSelectedRecords([])
    } else {
      const recordIds = search.get('recordIds')?.split?.(',') ?? []
      setSelectedRecords(
        records.filter((r) => recordIds.includes(r.id.toString())),
      )
    }
  }, [location.search, records])

  const handleActionPerformed = (): any => {
    console.log('action performed');
    return fetchData();
  }

  const handlePaginationChange = (pageNumber: number): void => {
    storeParams({page: pageNumber.toString()})
  }

  const contentTag = getActionElementCss(resource.id, 'list', 'table-wrapper')

  return (
    <Box variant="container" data-css={contentTag}>
      <RecordsTable
        resource={newResource}
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
