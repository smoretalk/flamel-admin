import React from 'react';
import { Box, Button, H2, H5, Illustration, Text, } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import { useTranslation } from 'adminjs';
const pageHeaderHeight = 284;
const pageHeaderPaddingY = 74;
const pageHeaderPaddingX = 250;
export const DashboardHeader = () => {
    const { translateMessage } = useTranslation();
    return (React.createElement(Box, { position: "relative", overflow: "hidden", "data-css": "default-dashboard" },
        React.createElement(Box, { position: "absolute", top: 50, left: -10, opacity: [0.2, 0.4, 1], animate: true },
            React.createElement(Illustration, { variant: "Rocket" })),
        React.createElement(Box, { position: "absolute", top: -70, right: -15, opacity: [0.2, 0.4, 1], animate: true },
            React.createElement(Illustration, { variant: "Moon" })),
        React.createElement(Box, { bg: "grey100", height: pageHeaderHeight, py: pageHeaderPaddingY, px: ['default', 'lg', pageHeaderPaddingX] },
            React.createElement(Text, { textAlign: "center", color: "white" },
                React.createElement(H2, null, translateMessage('welcomeOnBoard_title')),
                React.createElement(Text, { opacity: 0.8 }, translateMessage('welcomeOnBoard_subtitle'))))));
};
const boxes = ({ translateMessage }) => [
    {
        variant: 'Planet',
        title: translateMessage('addingResources_title'),
        subtitle: translateMessage('addingResources_subtitle'),
        href: 'https://adminjs.co/tutorial-passing-resources.html',
    },
    {
        variant: 'DocumentCheck',
        title: translateMessage('customizeResources_title'),
        subtitle: translateMessage('customizeResources_subtitle'),
        href: 'https://adminjs.co/tutorial-customizing-resources.html',
    },
    {
        variant: 'DocumentSearch',
        title: translateMessage('customizeActions_title'),
        subtitle: translateMessage('customizeActions_subtitle'),
        href: 'https://adminjs.co/tutorial-actions.html',
    },
    {
        variant: 'FlagInCog',
        title: translateMessage('writeOwnComponents_title'),
        subtitle: translateMessage('writeOwnComponents_subtitle'),
        href: 'https://adminjs.co/tutorial-writing-react-components.html',
    },
    {
        variant: 'Folders',
        title: translateMessage('customDashboard_title'),
        subtitle: translateMessage('customDashboard_subtitle'),
        href: 'https://adminjs.co/tutorial-custom-dashboard.html',
    },
    {
        variant: 'Astronaut',
        title: translateMessage('roleBasedAccess_title'),
        subtitle: translateMessage('roleBasedAccess_subtitle'),
        href: 'https://adminjs.co/tutorial-rbac.html',
    },
];
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
export const Dashboard = () => {
    const { translateMessage, translateButton } = useTranslation();
    return (React.createElement(Box, null,
        React.createElement(DashboardHeader, null),
        React.createElement(Box, { mt: ['xl', 'xl', '-100px'], mb: "xl", mx: [0, 0, 0, 'auto'], px: ['default', 'lg', 'xxl', '0'], position: "relative", flex: true, flexDirection: "row", flexWrap: "wrap", width: [1, 1, 1, 1024] },
            boxes({ translateMessage }).map((box, index) => (React.createElement(Box, { key: index, width: [1, 1 / 2, 1 / 2, 1 / 3], p: "lg" },
                React.createElement(Card, { as: "a", href: box.href, target: "_blank" },
                    React.createElement(Text, { textAlign: "center" },
                        React.createElement(Illustration, { variant: box.variant, width: 100, height: 70 }),
                        React.createElement(H5, { mt: "lg" }, box.title),
                        React.createElement(Text, null, box.subtitle)))))),
            React.createElement(Box, { width: [1, 1, 1 / 2], p: "lg" },
                React.createElement(Card, { as: "a", flex: true, href: "https://adminjs.page.link/slack", target: "_blank" },
                    React.createElement(Box, { flexShrink: 0 },
                        React.createElement(Illustration, { variant: "SlackLogo" })),
                    React.createElement(Box, { ml: "xl" },
                        React.createElement(H5, null, translateMessage('community_title')),
                        React.createElement(Text, null, translateMessage('community_subtitle'))))),
            React.createElement(Box, { width: [1, 1, 1 / 2], p: "lg" },
                React.createElement(Card, { as: "a", flex: true, href: "https://github.com/SoftwareBrothers/adminjs/issues", target: "_blank" },
                    React.createElement(Box, { flexShrink: 0 },
                        React.createElement(Illustration, { variant: "GithubLogo" })),
                    React.createElement(Box, { ml: "xl" },
                        React.createElement(H5, null, translateMessage('foundBug_title')),
                        React.createElement(Text, null, translateMessage('foundBug_subtitle'))))),
            React.createElement(Card, { width: 1, m: "lg" },
                React.createElement(Text, { textAlign: "center" },
                    React.createElement(Illustration, { variant: "AdminJSLogo" }),
                    React.createElement(H5, null, translateMessage('needMoreSolutions_title')),
                    React.createElement(Text, null, translateMessage('needMoreSolutions_subtitle')),
                    React.createElement(Text, { mt: "xxl" },
                        React.createElement(Button, { as: "a", variant: "contained", href: "https://share.hsforms.com/1IedvmEz6RH2orhcL6g2UHA8oc5a", target: "_blank" }, translateButton('contactUs'))))))));
};
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map