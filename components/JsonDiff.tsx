import React, { ReactNode } from 'react'
import _ from 'lodash'
import { Badge, Section, FormGroup, Label } from '@adminjs/design-system'
import {ShowPropertyProps, flat, FlattenValue, useTranslation} from "adminjs";
import { default as DiffViewer } from "react-diff-viewer-continued";

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
      <DiffViewer.default oldValue={JSON.stringify(flat.unflatten(before), null, 2)} newValue={JSON.stringify(flat.unflatten(after), null, 2)} />
    </FormGroup>
  );
}

export default React.memo(JsonDiff)
