import {theme, ValueGroup} from '@adminjs/design-system';
import {
  RecordJSON,
  PropertyJSON,
  flat, useTranslation,
} from 'adminjs';
import React from 'react';
import ReferenceValue from './ReferenceValue.js';
import {ThemeProvider} from "styled-components";

type Props = {
  property: PropertyJSON;
  record: RecordJSON;
  ItemComponent: typeof React.Component;
};

export default function ManyToManyShow(props: Props) {
  const { translateProperty } = useTranslation();

  const {property, record, ItemComponent} = props;
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
      <ValueGroup label={translateProperty(property.label)}>
        {(items || []).map((item, i) => {
          // const itemProperty = convertToSubProperty(property, i);
          return (
            <ReferenceValue
              key={i}
              {...props}
              record={item}
              property={property}
            />
          );
        })}

        {/*<Section> {(items || []).map((item, i) => {
            const itemProperty = convertToSubProperty(property, i);
            return (
              <ItemComponent
                {...this.props}
                key={itemProperty.path}
                property={itemProperty}
              />
            );
          })}
        </Section>
					*/}
      </ValueGroup>
    </ThemeProvider>
  );
}
