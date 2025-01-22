import React from 'react'
import { FormGroup, Label } from '@adminjs/design-system'
import {ShowPropertyProps, flat, useTranslation} from "adminjs";
import RDV from "react-diff-viewer-continued/lib/src/index.js";

let ReactDiffViewer: React.ElementType;

if (typeof RDV.default !== 'undefined') {
  ReactDiffViewer = RDV.default as unknown as React.ElementType;
} else {
  ReactDiffViewer = RDV as unknown as React.ElementType;
}

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
      <ReactDiffViewer oldValue={JSON.stringify(flat.unflatten(before), null, 2)} newValue={JSON.stringify(flat.unflatten(after), null, 2)} />
    </FormGroup>
  );
}

export default React.memo(JsonDiff)
