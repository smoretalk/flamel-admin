import React from 'react';
import {styled} from '@adminjs/design-system/styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@adminjs/design-system';
import {ViewHelpers, PropertyJSON, flat} from 'adminjs';

interface Props {
  property: PropertyJSON;
  record: any;
}

const StyledLink = styled(Link)`
  padding-left: ${({ theme }): string => theme.space?.xs};
  padding-right: ${({ theme }): string => theme.space?.xs};
`;

const ReferenceValue: React.FC<Props> = (props) => {
  const { property, record } = props;

  const h = new ViewHelpers();
  // const refId = record.params[property.path];
  const refId = record[property.props.pk];
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
  console.log(record, property.props.title, flat.get(record, property.props.title));
  const href = h.recordActionUrl({
    resourceId: property.props.reference || property.reference,
    recordId: refId,
    actionName: 'show',
  });
  return (
    <StyledLink to={href}>
      <Button size="xs" rounded variant="outlined">
        {(flat.flatten(record) as Record<string, string>)[property.props.title]}
      </Button>
    </StyledLink>
  );
};

export default ReferenceValue;
