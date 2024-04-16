import React, { useState } from "react";
import { Link, Label } from '@adminjs/design-system';
const ImageIdLink = (props) => {
    const [src, setSrc] = useState(props.record.params[props.property.props.linkProp]);
    const srcId = Number(src);
    if (!Number.isNaN(srcId)) {
        return (React.createElement("section", { style: { marginBottom: props.where === 'show' ? 24 : 0 } },
            props.where === 'show' && (React.createElement(Label, null, props.property.props.linkLabel)),
            !Number.isNaN(srcId)
                ? React.createElement(Link, { variant: "text", href: `/admin/resources/Image/records/${srcId}/show` }, srcId)
                : React.createElement("span", null, src)));
    }
};
export default ImageIdLink;
//# sourceMappingURL=ImageIdLink.js.map