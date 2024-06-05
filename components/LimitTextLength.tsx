import { type ShowPropertyProps, useTranslation } from 'adminjs'
import { Badge } from '@adminjs/design-system'
import React, { type FC } from 'react'
import startCase from 'lodash/startCase.js'

const DefaultPropertyValue: FC<ShowPropertyProps> = ({
                                                       property: { propertyPath, availableValues, path, props },
                                                       record,
                                                       resource: { id: resourceId },
                                                     }) => {
  const rawValue = record?.params[path]
  const { translateProperty } = useTranslation()

  if (typeof rawValue === 'undefined') return null

  // eslint-disable-next-line eqeqeq
  const option = availableValues?.find((opt) => opt.value == rawValue)

  if (option) {
    const label = option.label || rawValue
    return (
      <Badge>
        {translateProperty(`${propertyPath}.${label}`, resourceId, {
          defaultValue: startCase(label),
        })}
      </Badge>
    )
  }

  return rawValue.slice(0, props.maxLen)
}

const LimitTextLength: React.FC<ShowPropertyProps> = (props) => (<DefaultPropertyValue {...props} />)

export default LimitTextLength;
