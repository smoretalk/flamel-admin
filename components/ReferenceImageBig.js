import React, { useState } from "react";
const ReferenceImageBig = (props) => {
    const [errored, setErrored] = useState(false);
    const [src, setSrc] = useState(() => {
        const referenceLink = props.record.params[props.property.props.name || 'GenerationInfo.referenceLink'];
        if (referenceLink) {
            if (referenceLink.includes('/')) {
                return `/api/admin/owners/${referenceLink.split('/')[0]}/images/${referenceLink.split('/')[1]}`;
            }
            return `/api/admin/images/${referenceLink}/binary`;
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
            }, htmlFor: "image", className: "adminjs_Label" }, "\uCC38\uACE0 \uC774\uBBF8\uC9C0")),
        React.createElement("div", null,
            React.createElement("img", { width: 512, id: "image", alt: props.record.params.originalPrompt, src: src }),
            src)));
};
export default ReferenceImageBig;
//# sourceMappingURL=ReferenceImageBig.js.map