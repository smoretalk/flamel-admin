import { Button, DrawerContent, DrawerFooter, Icon, MessageBox, Table, TableBody, TableCell, TableRow, Text } from '@adminjs/design-system'
import React, {ReactNode, useState} from 'react'
import { useNavigate } from 'react-router'
import {getActionElementCss, ApiClient, ActionHeader, BasePropertyComponent, ActionProps, withNotice, AddNoticeProps, useTranslation } from 'adminjs'
import {appendForceRefresh} from "../utils/append-force-refresh.js";


const BulkCollectionReject: React.FC<ActionProps & AddNoticeProps> = (props) => {
  const { resource, records, action, addNotice } = props

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { translateMessage, translateButton } = useTranslation()

  if (!records) {
    return (
      <Text>
        {translateMessage('pickSomeFirstToRemove', resource.id)}
      </Text>
    )
  }

  const handleClick = (): void => {
    const api = new ApiClient()
    setLoading(true)
    const recordIds = records.map((r) => r.id)
    api.bulkAction({
      resourceId: resource.id,
      actionName: action.name,
      recordIds,
      method: 'post',
    }).then(((response) => {
      setLoading(false)
      if (response.data.notice) {
        addNotice(response.data.notice)
      }
      if (response.data.redirectUrl) {
        const search = new URLSearchParams(window.location.search)
        // bulk function have recordIds in the URL so it has to be stripped before redirect
        search.delete('recordIds')
        navigate(appendForceRefresh(response.data.redirectUrl, search.toString()))
      }
    })).catch((error) => {
      setLoading(false)
      addNotice({
        message: translateMessage('bulkDeleteError', resource.id),
        type: 'error',
      })
      throw error
    })
  }

  const contentTag = getActionElementCss(resource.id, action.name, 'drawer-content')
  const tableTag = getActionElementCss(resource.id, action.name, 'table')
  const footerTag = getActionElementCss(resource.id, action.name, 'drawer-footer')

  return (
    <>
      <DrawerContent data-css={contentTag}>
        {action?.showInDrawer ? <ActionHeader omitActions {...props} /> : null}
        <MessageBox
          mb="xxl"
          variant="danger"
          message={translateMessage(records.length > 1 ? 'theseRecordsWillBeRejected_plural' : 'theseRecordsWillBeRejected', resource.id, { count: records.length })}
        />
        <Table data-css={tableTag}>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <BasePropertyComponent
                    where="list"
                    property={resource.titleProperty}
                    resource={resource}
                    record={record}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DrawerContent>
      <DrawerFooter data-css={footerTag}>
        <Button variant="contained" size="lg" onClick={handleClick} disabled={loading}>
          {loading ? (<Icon icon="Loader" spin />) : null}
          {translateButton(records.length > 1 ? 'confirmBulkCollectionReject_plural' : 'confirmBulkCollectionReject', resource.id, { count: records.length })}
        </Button>
      </DrawerFooter>
    </>
  )
};

export default withNotice(BulkCollectionReject) as React.FC;