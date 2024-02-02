import React from 'react';
import {styled, useTheme} from '@adminjs/design-system/styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@adminjs/design-system';
import { ViewHelpers, PropertyJSON } from 'adminjs';

interface Props {
  property: PropertyJSON;
  record: any;
}

const StyledLink = styled(Link)`
  padding-left: ${({ theme }): string => {
    console.log('theme', theme);
    return theme.space?.xs
  }};
  padding-right: ${({ theme }): string => theme.space?.xs};
`;

const ReferenceValue: React.FC<Props> = (props) => {
  const { property, record } = props;

  const h = new ViewHelpers();
  // const refId = record.params[property.path];
  const refId = record.id;
  // const populated = record.populated[property.path];
  // const value = (populated && populated.title) || refId;

  // if (!property.reference) {
  //   throw new Error(`property: "${property.path}" does not have a reference`);
  // }

  // if (populated && populated.recordActions.find((a) => a.name === 'show')) {
  //   const href = h.recordActionUrl({
  //     resourceId: property.reference,
  //     recordId: refId,
  //     actionName: 'show',
  //   });
  //   return (
  //     <StyledLink variant="text" to={href}>
  //       {JSON.stringify(record)}
  //       Probandoo
  //       {value}
  //     </StyledLink>
  //   );
  // }
  const href = h.recordActionUrl({
    resourceId: property.reference,
    recordId: refId,
    actionName: 'show',
  });
  return (
    <StyledLink to={href}>
      <Button size="xs" rounded>
        {record.title}
      </Button>
    </StyledLink>
  );
};

export default ReferenceValue;
