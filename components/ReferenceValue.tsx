import React from 'react';
import { styled } from '@adminjs/design-system/styled-components';
import { Link } from 'react-router-dom';
import { ButtonCSS, Button } from '@adminjs/design-system';
import { RecordJSON, ViewHelpers, PropertyJSON } from 'adminjs';

// import ViewHelpers from '../../../../backend/utils/view-helpers/view-helpers';
// import { RecordJSON, PropertyJSON } from '../../../interfaces';

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
      <Button size="sm" rounded>
        {record.title}
      </Button>
    </StyledLink>
  );
};

export default ReferenceValue;
