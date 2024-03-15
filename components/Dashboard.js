import React, { useState } from "react";
import { Box, Button, DropZone, H2, H5, Icon, Illustration, Text } from "@adminjs/design-system";
import { styled } from '@adminjs/design-system/styled-components';
import { useTranslation } from 'adminjs';
import axios from "axios";
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
export const Dashboard = (props) => {
    console.log('dashboard props', props);
    const { translateMessage, translateButton } = useTranslation();
    const [imageFiles, setImageFiles] = useState([]);
    const [themeFiles, setThemeFiles] = useState([]);
    const uploadImageFiles = (scaleSize) => async (files) => {
        setImageFiles(files);
        try {
            const formData = new FormData();
            formData.append('scaleSize', scaleSize);
            files.forEach((file) => {
                formData.append('file', file);
            });
            await axios.post('/api/s3/collectionImages', formData);
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                alert(err.response.data);
            }
            console.error(err);
        }
        setImageFiles([]);
    };
    const uploadThemeFiles = async (files) => {
        setThemeFiles(files);
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('file', file);
            });
            const res = await axios.post('/api/s3/collectionThemes', formData);
            if (res.data.length) {
                alert('중복: ' + res.data.join(', '));
            }
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                console.error(err.response.data);
            }
            console.error(err);
        }
        setThemeFiles([]);
    };
    return (React.createElement(Box, null,
        React.createElement(DashboardHeader, null),
        React.createElement(Box, { mt: ['xl', 'xl', '-100px'], mb: "xl", mx: [0, 0, 0, 'auto'], px: ['default', 'lg', 'xxl', '0'], position: "relative", flex: true, flexDirection: "row", flexWrap: "wrap", width: [1, 1, 1, 1024] },
            React.createElement(Box, { width: [1, 1 / 2, 1 / 2, 1 / 3], p: "lg" },
                React.createElement(Card, { as: "a" },
                    React.createElement(Text, { textAlign: "center" },
                        React.createElement(Icon, { icon: "Image" }),
                        React.createElement(H5, { mt: "lg" }, translateMessage('uploadCollectionImages1x')),
                        React.createElement(Text, null, translateMessage('uploadCollectionImages1x_detail')),
                        React.createElement(DropZone, { files: imageFiles, multiple: true, onChange: uploadImageFiles('1x') })))),
            React.createElement(Box, { width: [1, 1 / 2, 1 / 2, 1 / 3], p: "lg" },
                React.createElement(Card, { as: "a" },
                    React.createElement(Text, { textAlign: "center" },
                        React.createElement(Icon, { icon: "Image" }),
                        React.createElement(H5, { mt: "lg" }, translateMessage('uploadCollectionImages2x')),
                        React.createElement(Text, null, translateMessage('uploadCollectionImages2x_detail')),
                        React.createElement(DropZone, { files: imageFiles, multiple: true, onChange: uploadImageFiles('2x') })))),
            React.createElement(Box, { width: [1, 1 / 2, 1 / 2, 1 / 3], p: "lg" },
                React.createElement(Card, { as: "a" },
                    React.createElement(Text, { textAlign: "center" },
                        React.createElement(Icon, { icon: "Image" }),
                        React.createElement(H5, { mt: "lg" }, translateMessage('uploadCollectionTheme')),
                        React.createElement(Text, null, translateMessage('uploadCollectionTheme_detail')),
                        React.createElement(DropZone, { files: themeFiles, multiple: true, onChange: uploadThemeFiles })))),
            React.createElement(Box, { width: [1, 1, 1 / 2], p: "lg" },
                React.createElement(Card, { as: "a", flex: true, href: "https://smoretalk-io.slack.com/ssb/redirect", target: "_blank" },
                    React.createElement(Box, { flexShrink: 0 },
                        React.createElement(Illustration, { variant: "SlackLogo" })),
                    React.createElement(Box, { ml: "xl" },
                        React.createElement(H5, null, translateMessage('community_title')),
                        React.createElement(Text, null, translateMessage('community_subtitle'))))),
            React.createElement(Box, { width: [1, 1, 1 / 2], p: "lg" },
                React.createElement(Card, { as: "a", flex: true, href: "https://github.com/smoretalk/alchemist-back/issues", target: "_blank" },
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