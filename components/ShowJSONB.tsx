import React, { ReactNode } from 'react'
import _ from 'lodash'
import { unflatten } from 'flat'
import { Badge, Section, FormGroup, Label } from '@adminjs/design-system'
import {ShowPropertyProps, flat, FlattenValue, useTranslation} from "adminjs";

const mapBoolean = (value: unknown) => {
  if (typeof value === 'undefined') {
    return '';
  }
  return value ? 'Yes' : 'No';
};

class JSONBEntry extends React.PureComponent<{ paramObject: ReactNode }> {
  override render() {
    const { paramObject } = this.props;

    if(typeof paramObject === 'boolean'){
      return (
        <Badge outline size="sm">{mapBoolean(paramObject)}</Badge>
      )
    }

    if(_.isNil(paramObject)){
      return <Badge outline size="sm">null</Badge>
    }

    if(typeof paramObject !== 'object'){
      return paramObject;
    }

    return (
      <Section>
        {Object.entries(paramObject).map(([key, value]) => (
          <FormGroup key={key}>
            <Label>{key}</Label>
            <JSONBEntry paramObject={value}/>
          </FormGroup>
        ))}
      </Section>
    );
  }
}

const ShowJSONB = (props: ShowPropertyProps) => {
  const { property, record } = props;
  const {translateProperty} = useTranslation();

  const matchingParams = _.chain(record.params)
    .omitBy(_.isNil)
    .pickBy((value, key) => key.startsWith(property.name))
    .value() as { [key: string]: FlattenValue };

  const paramObject = flat.get(matchingParams, property.name);

  return (
    <FormGroup>
      <Label>{translateProperty(property.label)}</Label>
      <JSONBEntry paramObject={paramObject}/>
    </FormGroup>
  );
}

export default React.memo(ShowJSONB)
