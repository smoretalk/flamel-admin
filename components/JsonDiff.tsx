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
  Object.entries(difference).forEach(([key, value]) => {
    if (difference[key].before) {
      before[key] = value;
    }
    if (difference[key].after) {
      after[key] = value;
    }
  })

  return (
    <FormGroup>
      <Label>{translateProperty(property.label)}</Label>
      <DiffViewer oldValue={flat.unflatten(before)} newValue={flat.unflatten(after)} />
    </FormGroup>
  );
}

export default React.memo(JsonDiff)
