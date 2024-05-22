import React, { useState } from "react";
import { Link, Label } from '@adminjs/design-system';
const LLMPromptIdLink = (props) => {
    console.log(props.record);
    const [src, setSrc] = useState(props.record.populated['GenerationInfo.imageId']?.params.LLMPrompt);
    const srcId = Number(src);
    return (React.createElement("section", { style: { marginBottom: props.where === 'show' ? 24 : 0 } },
        props.where === 'show' && (React.createElement(Label, { variant: "light" }, props.property.props.linkLabel)),
        !Number.isNaN(srcId) && srcId !== 0
            ? React.createElement(Link, { variant: "success", href: `/admin/resources/llmPrompt/records/${srcId}/show` }, srcId)
            : React.createElement("span", null, src)));
};
export default LLMPromptIdLink;
//# sourceMappingURL=LLMPromptIdLink.js.map