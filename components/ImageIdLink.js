import React, { useState } from "react";
import { Link, Label } from '@adminjs/design-system';
const ImageIdLink = (props) => {
    const [src, setSrc] = useState(props.record.params[props.property.props.linkProp]);
    console.log(props);
    const srcId = Number(src);
    return (React.createElement("section", { style: { marginBottom: props.where === 'show' ? 24 : 0 } },
        props.where === 'show' && (React.createElement(Label, { variant: "light" }, props.property.props.linkLabel)),
        !Number.isNaN(srcId) && srcId !== 0
            ? React.createElement(Link, { variant: "success", href: `/admin/resources/Image/records/${srcId}/show` }, srcId)
            : React.createElement("span", null, src)));
};
export default ImageIdLink;
//# sourceMappingURL=ImageIdLink.js.map