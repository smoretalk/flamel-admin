import * as React from 'react';
import { Box, Label } from '@adminjs/design-system';
// @ts-ignore
import ReactJson from 'react18-json-view';
import 'react18-json-view/src/style.css'
import * as _ from 'lodash';
import { unflatten } from 'flat';

const EditJSONB = (props: any) => {
  const { property, record, onChange } = props;
  const matchingParams = _.chain(record.params)
    .omitBy(_.isNil)
    .pickBy((value, key) => key.startsWith(property.name))
    .value();

  const object: any = unflatten(matchingParams);
  const paramObject = object?.[property.name];

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
      <Label>{property.label}</Label>
      <ReactJson
        name={property.name}
        collapsed={false}
        src={paramObject}
        onEdit={onEdit}
        onAdd={onAdd}
        onDelete={onDelete}
      />
    </Box>
  );
};

export default EditJSONB;
