import React, { useState } from "react";
const DisplayNestedImageBig = (props) => {
    const [errored, setErrored] = useState(false);
    const [src, setSrc] = useState(props.record.populated.Image.params.link.replace(/\/api\/users\//, '/api/admin/'));
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
            React.createElement("img", { width: 512, id: "image", alt: props.record.params.promptKo, src: src }))));
};
export default DisplayNestedImageBig;
//# sourceMappingURL=DisplayNestedImageBig.js.map