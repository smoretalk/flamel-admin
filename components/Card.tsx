import {styled} from "@adminjs/design-system/styled-components";
import {Box} from "@adminjs/design-system";

type BoxType = {
  variant: string;
  title: string;
  subtitle: string;
  href: string;
};

type Props = {
  theme: {
    colors: {
      grey100: string,
      primary100: string
    },
    shadows: {
      cardHover: string
    }
    space: {
      md: string,
    },
  },
  flex: boolean,
}

const Card = styled(Box)`
  display: ${({ flex }: Props): string => (flex ? 'flex' : 'block')};
  color: ${({ theme }: Props) => theme.colors.grey100};
  height: 100%;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: ${({ theme }: Props) => theme.space.md};
  transition: all 0.1s ease-in;
  background: white;
  padding: 24px 0;

  @media screen and (min-width: 577px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  &:hover {
    border: 1px solid ${({ theme }: Props) => theme.colors.primary100};
    box-shadow: ${({ theme }: Props) => theme.shadows.cardHover};
  }
`;

Card.defaultProps = {
  variant: 'container',
  boxShadow: 'card',
};
export default Card;
