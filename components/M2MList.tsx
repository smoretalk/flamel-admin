import {
  RecordJSON,
  PropertyJSON,
  flat,
} from 'adminjs';
import React, { ReactNode } from 'react';
import ReferenceValue from './ReferenceValue.js';
import {ThemeProvider} from "styled-components";
import {theme} from "@adminjs/design-system";

type Props = {
  property: PropertyJSON;
  record: RecordJSON;
  ItemComponent: typeof React.Component;
};

export default class ManyToManyList extends React.PureComponent<Props> {
  override render(): ReactNode {
    const { property, record, ItemComponent } = this.props;
    const DELIMITER = '.';

    const getSubpropertyPath = (path: string, index: number) =>
      [path, index].join(DELIMITER);

    const convertToSubProperty = (
      arrayProperty: PropertyJSON,
      index: number,
    ): PropertyJSON => ({
      ...arrayProperty,
      path: getSubpropertyPath(arrayProperty.path, index),
      label: `[${index + 1}]`,
      isArray: false,
      isDraggable: false,
    });

    const items: object[] = flat.get(record.params, property.path) || [];

    return (
      <ThemeProvider theme={theme}>
        {(items || []).map((item, i) => {
          // const itemProperty = convertToSubProperty(property, i);
          return (
            <ReferenceValue
              key={i}
              {...this.props}
              record={item}
              property={property}
            />
          );
        })}
      </ThemeProvider>
    );
  }
}
