import React from 'react'
import { FormGroup, Label } from '@adminjs/design-system'
import {ShowPropertyProps, flat, useTranslation} from "adminjs";
import Viewer from "react-json-view-compare";

const JsonDiff = (props: ShowPropertyProps) => {
  const { property, record } = props;
  const {translateProperty} = useTranslation();

  const difference = JSON.parse(record.params.difference);
  const before: { [key: string]: any } = {}
  const after: { [key: string]: any } = {};
  Object.entries<{ after?: any, before?: any }>(difference).forEach(([key, value]) => {
    if (value.before) {
      before[key] = value.before;
    }
    if (value.after) {
      after[key] = value.after;
    }
  })

  return (
    <FormGroup>
      <Label>{translateProperty(property.label)}</Label>
      <Viewer oldData={flat.unflatten(before)} newData={flat.unflatten(after)} />
    </FormGroup>
  );
}

export default React.memo(JsonDiff)
