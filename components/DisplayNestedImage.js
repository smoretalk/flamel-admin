import React, { useState } from "react";
const DisplayNestedImage = (props) => {
    const [errored, setErrored] = useState(false);
    const [src, setSrc] = useState(props.record.populated.Image.params.link.replace(/\/api\/users\//, '/api/admin/') +
        '/thumb');
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
            React.createElement("img", { width: 100, id: "image", alt: props.record.params.promptKo, onError: onError, src: src }))));
};
export default DisplayNestedImage;
//# sourceMappingURL=DisplayNestedImage.js.map