import React, { ReactNode } from 'react'
import _ from 'lodash'
import { unflatten } from 'flat'
import { Badge, Section, FormGroup, Label } from '@adminjs/design-system'
import {ShowPropertyProps, flat, FlattenValue} from "adminjs";

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
          <FormGroup>
            <Label>{key}</Label>
            <JSONBEntry paramObject={value}/>
          </FormGroup>
        ))}
      </Section>
    );
  }
}

export default class ShowJSONB extends React.PureComponent<ShowPropertyProps> {
  override render() {
    const { property, record } = this.props;

    const matchingParams = _.chain(record.params)
      .omitBy(_.isNil)
      .pickBy((value, key) => key.startsWith(property.name))
      .value() as { [key: string]: object };

    const unflattened = unflatten(matchingParams) as { [key: string]: FlattenValue };
    const paramObject = flat.get(unflattened, property.name);

    return (
      <FormGroup>
        <Label>{property.label}</Label>
        <JSONBEntry paramObject={paramObject}/>
      </FormGroup>
    );
  }
}
