import React, { useState } from "react";
const DisplayImageBig = (props) => {
    const [src, setSrc] = useState(props.record.params.link);
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
            React.createElement("img", { width: 512, id: "image", alt: props.record.params.code, src: src }))));
};
export default DisplayImageBig;
//# sourceMappingURL=DisplayLinkBig.js.map