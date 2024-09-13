import * as React from 'react';
import { Box, Label } from '@adminjs/design-system';
import ReactJson from '@microlink/react-json-view';
import * as _ from 'lodash';
import { unflatten } from 'flat';
import {flat, useTranslation} from "adminjs";

const EditJSONB = (props: any) => {
  const { property, record, onChange } = props;
  const {translateProperty} = useTranslation();

  const matchingParams = _.chain(record.params)
    .pickBy((value, key) => key.startsWith(property.name))
    .value();

  const paramObject = flat.get(matchingParams, property.name)

  const saveData = (data: any): void => {
    onChange(property.name, data);
  };

  const onEdit = (event: any) => {
    const updated_src = event?.updated_src;
    saveData(updated_src);
  };

  const onAdd = (event: any) => {
    const updated_src = event?.updated_src;
    saveData(updated_src);
  };

  const onDelete = (event: any) => {
    const updated_src = event?.updated_src;
    saveData(updated_src);
  };

  return (
    <Box mb="xl">
      <Label>{translateProperty(property.label)}</Label>
      {/* @ts-ignore */}
      <ReactJson
        name={property.name}
        collapsed={false}
        src={paramObject || {}}
        onEdit={onEdit}
        onAdd={onAdd}
        onDelete={onDelete}
      />
    </Box>
  );
};

export default EditJSONB;
