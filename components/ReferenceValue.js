import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@adminjs/design-system';
import { ViewHelpers } from 'adminjs';
const StyledLink = styled(Link) `
  padding-left: ${({ theme }) => theme.space?.xs};
  padding-right: ${({ theme }) => theme.space?.xs};
`;
const ReferenceValue = (props) => {
    const { property, record } = props;
    const h = new ViewHelpers();
    const refId = record.id;
    const href = h.recordActionUrl({
        resourceId: property.reference,
        recordId: refId,
        actionName: 'show',
    });
    return (React.createElement(StyledLink, { to: href },
        React.createElement(Button, { size: "sm", rounded: true }, record.name)));
};
export default ReferenceValue;
//# sourceMappingURL=ReferenceValue.js.map