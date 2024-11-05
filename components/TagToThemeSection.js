import { Box, Button, H5, Icon, Input, Label } from "@adminjs/design-system";
import React, { useState } from "react";
import Card from "./Card.js";
import { useTranslation } from "adminjs";
import axios from "axios";
export default function TagToThemeSection({}) {
    const { translateMessage } = useTranslation();
    const [tag, setTag] = useState('');
    const [themeId, setThemeId] = useState(null);
    function onChangeTag(e) {
        setTag(e.target.value);
    }
    function onChangeTheme(e) {
        setThemeId(parseInt(e.target.value, 10));
    }
    async function onSubmit(e) {
        e.preventDefault();
        console.log('submitting', tag, themeId);
        try {
            await axios.patch(`/api/collections/tags/${tag}/connectTheme?themeId=${themeId}`, {}, {
                timeout: 60_000,
            });
            setTag('');
            alert("태그가 추가되었습니다");
        }
        catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(err.response.data?.data);
            }
        }
    }
    return (React.createElement(Box, { width: [1, 1, 1 / 2], p: "lg" },
        React.createElement(Card, { as: "form", onSubmit: onSubmit },
            React.createElement(Icon, { icon: "Gift" }),
            React.createElement(H5, { mt: "lg" }, translateMessage('tagToTheme_title')),
            React.createElement(Box, null,
                React.createElement(Label, null, "\uD0DC\uADF8"),
                React.createElement(Input, { onChange: onChangeTag, type: "text", placeholder: "\uC785\uB825", required: true, value: tag, style: { width: '100%' } })),
            React.createElement(Box, null,
                React.createElement(Label, null, "\uB300\uC8FC\uC81C\uC544\uC774\uB514"),
                React.createElement(Input, { onChange: onChangeTheme, type: "number", placeholder: "\uC22B\uC790", required: true, value: themeId, style: { width: '100%' } })),
            React.createElement(Box, null,
                React.createElement(Button, { variant: "contained", onClick: onSubmit }, "\uCD94\uAC00")))));
}
//# sourceMappingURL=TagToThemeSection.js.map