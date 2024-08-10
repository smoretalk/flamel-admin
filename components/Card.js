import { styled } from "@adminjs/design-system/styled-components";
import { Box } from "@adminjs/design-system";
const Card = styled(Box) `
  display: ${({ flex }) => (flex ? 'flex' : 'block')};
  color: ${({ theme }) => theme.colors.grey100};
  height: 100%;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.space.md};
  transition: all 0.1s ease-in;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary100};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;
Card.defaultProps = {
    variant: 'container',
    boxShadow: 'card',
};
export default Card;
//# sourceMappingURL=Card.js.map