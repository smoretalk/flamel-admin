import React, { useState } from "react";
const DisplayStyleImage = (props) => {
    console.log(props);
    const [errored, setErrored] = useState(false);
    const [src, setSrc] = useState(() => {
        const referenceLink = props.record.params[props.property.props.target];
        if (referenceLink) {
            if (referenceLink.startsWith('/api/collections')) {
                return referenceLink;
            }
            else if (referenceLink.startsWith('/api/images/reference/')) {
                const name = referenceLink.replace('/api/images/reference/', '');
                return `/api/admin/owners/${props.record.params.User}/images/${name}/thumb`;
            }
            else if (referenceLink.startsWith('/api/images/')) {
                const id = parseInt(referenceLink.replace('/api/images/', ''));
                return `/api/admin/images/${id}/thumb`;
            }
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
            React.createElement("img", { width: 100, id: "image", alt: props.record.params.styleId, onError: onError, src: src }))));
};
export default DisplayStyleImage;
//# sourceMappingURL=DisplayStyleImage.js.map