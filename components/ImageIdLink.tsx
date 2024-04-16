import React, {useState} from "react";
import type {ShowPropertyProps} from 'adminjs';
import { Link, Label } from '@adminjs/design-system'

const ImageIdLink: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  const [src, setSrc] = useState(props.record.params[props.property.props.linkProp])

  console.log(props);
  const srcId = Number(src);
  return (
    <section style={{marginBottom: props.where === 'show' ? 24 : 0}}>
      {props.where === 'show' && (
        <Label variant="light">
          {props.property.props.linkLabel}
        </Label>
      )}
      {!Number.isNaN(srcId)
        ? <Link variant="text"
                href={`/admin/resources/Image/records/${srcId}/show`}>{srcId}</Link>
        : <span>{src}</span>
      }
    </section>
  );
};

export default ImageIdLink;
