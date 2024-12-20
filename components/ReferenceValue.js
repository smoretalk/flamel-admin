import React from 'react';
import { styled } from '@adminjs/design-system/styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@adminjs/design-system';
import { ViewHelpers, flat } from 'adminjs';
const StyledLink = styled(Link) `
  padding-left: ${({ theme }) => theme.space?.xs};
  padding-right: ${({ theme }) => theme.space?.xs};
`;
const ReferenceValue = (props) => {
    const { property, record } = props;
    const h = new ViewHelpers();
    const refId = record[property.props.pk];
    console.log(record, property.props.title, flat.get(record, property.props.title));
    const href = h.recordActionUrl({
        resourceId: property.props.reference || property.reference,
        recordId: refId,
        actionName: 'show',
    });
    return (React.createElement(StyledLink, { to: href },
        React.createElement(Button, { size: "xs", rounded: true, variant: "outlined" }, flat.flatten(record)[property.props.title])));
};
export default ReferenceValue;
//# sourceMappingURL=ReferenceValue.js.map