import React, { useState } from "react";
const ReferenceImage = (props) => {
    const [errored, setErrored] = useState(false);
    const [src, setSrc] = useState(() => {
        const referenceLink = props.record.params['GenerationInfo.referenceLink'];
        if (referenceLink) {
            if (referenceLink.includes('/')) {
                return `/api/admin/owners/${referenceLink.split('/')[0]}/images/${referenceLink.split('/')[1]}/thumb`;
            }
            return `/api/admin/images/${referenceLink}/thumb`;
        }
        return '';
    });
    const onError = () => {
        if (!errored) {
            setErrored(true);
            setSrc((prev) => prev?.replace("/thumb", ""));
        }
    };
    return (React.createElement("section", { style: { marginBottom: props.where === 'show' ? 24 : 0 } },
        props.where === 'show' && (React.createElement("label", { style: {
                display: 'block',
                fontFamily: 'Roboto, sans-serif',
                fontSize: 12,
                lineHeight: '16px',
                color: 'rgb(137, 138, 154)',
                marginBottom: 4,
                fontWeight: 300,
            }, htmlFor: "image", className: "adminjs_Label" }, "\uBBF8\uB9AC\uBCF4\uAE30")),
        React.createElement("div", null,
            React.createElement("img", { width: 100, id: "image", alt: props.record.params.originalPrompt, onError: onError, src: src }))));
};
export default ReferenceImage;
//# sourceMappingURL=ReferenceImage.js.map