import React, { useState } from "react";
const ReferenceImageBig = (props) => {
    const [errored, setErrored] = useState(false);
    const [src, setSrc] = useState(() => {
        const referenceLink = props.record.params['GenerationInfo.referenceLink'];
        if (referenceLink) {
            return `/api/admin/owners/${referenceLink.split('/')[0]}/images/${referenceLink.split('/')[1]}`;
        }
        return '';
    });
    return (React.createElement("section", { style: { marginBottom: props.where === 'show' ? 24 : 0 } },
        props.where === 'show' && (React.createElement("label", { style: {
                display: 'block',
                fontFamily: 'Roboto, sans-serif',
                fontSize: 12,
                lineHeight: '16px',
                color: 'rgb(137, 138, 154)',
                marginBottom: 4,
                fontWeight: 300,
            }, htmlFor: "image", className: "adminjs_Label" }, "\uB808\uD37C\uB7F0\uC2A4")),
        React.createElement("div", null,
            React.createElement("img", { width: 512, id: "image", alt: props.record.params.originalPrompt, src: src }))));
};
export default ReferenceImageBig;
//# sourceMappingURL=ReferenceImageBig.js.map